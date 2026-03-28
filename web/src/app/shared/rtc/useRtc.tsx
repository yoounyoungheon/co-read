import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";

interface UseRtcProps {
  roomId: string;
  myKey: string;
}

const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: "turn:8.229.223.216:3478/",
      username: "iddyoon",
      credential: "iddyoon",
    },
  ],
};

const SIGNALING_SERVER_URL =
  process.env.NEXT_PUBLIC_RTC_SIGNALING_URL ??
  "https://signaling.iamyounghun.co.kr/api/ws/consulting-room";

export function useRtc({ roomId, myKey }: UseRtcProps) {
  const consultationRoomId = `${roomId}consulting`;

  const hasStartedStreamRef = useRef(false);
  const otherKeyListRef = useRef<string[]>([]);
  const pcListMapRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingPeerConnectionRef = useRef<
    Map<string, Promise<RTCPeerConnection>>
  >(new Map());
  const peerStreamMapRef = useRef<Map<string, MediaStream>>(new Map());
  const pendingIceCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(
    new Map(),
  );
  const clientRef = useRef<Client | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const shouldCreateOffer = useCallback(
    (otherKey: string) => myKey.localeCompare(otherKey) < 0,
    [myKey],
  );

  const removeRemoteStream = useCallback((streamId: string) => {
    setRemoteStreams((prev) => prev.filter((stream) => stream.id !== streamId));
  }, []);

  const ensureLocalStream = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = stream;
    setLocalStream(stream);

    return stream;
  }, []);

  const cleanupPeerConnection = useCallback(
    (otherKey: string) => {
      const stream = peerStreamMapRef.current.get(otherKey);
      if (stream) {
        removeRemoteStream(stream.id);
        peerStreamMapRef.current.delete(otherKey);
      }

      const pc = pcListMapRef.current.get(otherKey);
      if (!pc) {
        return;
      }

      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      pc.close();
      pcListMapRef.current.delete(otherKey);
      pendingPeerConnectionRef.current.delete(otherKey);
      pendingIceCandidatesRef.current.delete(otherKey);
    },
    [removeRemoteStream],
  );

  const flushPendingIceCandidates = useCallback(async (otherKey: string) => {
    const pc = pcListMapRef.current.get(otherKey);
    const candidates = pendingIceCandidatesRef.current.get(otherKey);

    if (!pc || !pc.remoteDescription || !candidates?.length) {
      return;
    }

    for (const candidate of candidates) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("ICE candidate 적용 실패:", error);
      }
    }

    pendingIceCandidatesRef.current.delete(otherKey);
  }, []);

  const onIceCandidate = useCallback(
    (event: RTCPeerConnectionIceEvent, otherKey: string) => {
      if (!event.candidate || !clientRef.current?.connected) {
        return;
      }

      clientRef.current.publish({
        destination: `/app/peer/iceCandidate/${otherKey}/${consultationRoomId}`,
        body: JSON.stringify({ key: myKey, body: event.candidate }),
      });
    },
    [consultationRoomId, myKey],
  );

  const createPeerConnection = useCallback(
    async (otherKey: string) => {
      const existingPc = pcListMapRef.current.get(otherKey);
      if (existingPc) {
        return existingPc;
      }

      const pendingPc = pendingPeerConnectionRef.current.get(otherKey);
      if (pendingPc) {
        return pendingPc;
      }

      const pcPromise = (async () => {
        const pc = new RTCPeerConnection(RTC_CONFIGURATION);
        pcListMapRef.current.set(otherKey, pc);

        pc.onicecandidate = (event) => onIceCandidate(event, otherKey);
        pc.ontrack = (event) => {
          const stream = event.streams[0];

          if (!stream) {
            return;
          }

          peerStreamMapRef.current.set(otherKey, stream);
          setRemoteStreams((prev) => {
            const alreadyExists = prev.some(
              (currentStream) => currentStream.id === stream.id,
            );

            return alreadyExists ? prev : [...prev, stream];
          });
        };

        pc.onconnectionstatechange = () => {
          if (
            ["disconnected", "failed", "closed"].includes(pc.connectionState)
          ) {
            cleanupPeerConnection(otherKey);
          }
        };

        const localStream = await ensureLocalStream();

        localStream.getTracks().forEach((track) => {
          const senderExists = pc
            .getSenders()
            .some((sender) => sender.track?.kind === track.kind);

          if (!senderExists) {
            pc.addTrack(track, localStream);
          }
        });

        pendingPeerConnectionRef.current.delete(otherKey);
        return pc;
      })();

      pendingPeerConnectionRef.current.set(otherKey, pcPromise);
      return pcPromise;
    },
    [cleanupPeerConnection, ensureLocalStream, onIceCandidate],
  );

  const setLocalDescription = async (
    pc: RTCPeerConnection,
    description: RTCLocalSessionDescriptionInit,
  ) => {
    await pc.setLocalDescription(description);
  };

  const sendOffer = useCallback(
    async (pc: RTCPeerConnection, otherKey: string) => {
      if (
        pc.signalingState !== "stable" ||
        pc.localDescription?.type === "offer"
      ) {
        return;
      }

      const offer = await pc.createOffer();
      await setLocalDescription(pc, offer);

      clientRef.current?.publish({
        destination: `/app/peer/offer/${otherKey}/${consultationRoomId}`,
        body: JSON.stringify({ key: myKey, body: offer }),
      });
    },
    [consultationRoomId, myKey],
  );

  const sendAnswer = useCallback(
    async (pc: RTCPeerConnection, otherKey: string) => {
      const answer = await pc.createAnswer();
      await setLocalDescription(pc, answer);

      clientRef.current?.publish({
        destination: `/app/peer/answer/${otherKey}/${consultationRoomId}`,
        body: JSON.stringify({ key: myKey, body: answer }),
      });
    },
    [consultationRoomId, myKey],
  );

  const handleRemoteIceCandidate = useCallback(
    async (otherKey: string, candidate: RTCIceCandidateInit) => {
      const pc = pcListMapRef.current.get(otherKey);

      if (!pc || !pc.remoteDescription) {
        const queuedCandidates =
          pendingIceCandidatesRef.current.get(otherKey) ?? [];
        queuedCandidates.push(candidate);
        pendingIceCandidatesRef.current.set(otherKey, queuedCandidates);
        return;
      }

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("ICE candidate 처리 실패:", error);
      }
    },
    [],
  );

  const announceStreamStart = useCallback(async () => {
    if (!clientRef.current?.connected) {
      return;
    }

    for (const key of otherKeyListRef.current) {
      if (pcListMapRef.current.has(key) || !shouldCreateOffer(key)) {
        continue;
      }

      const pc = await createPeerConnection(key);
      await sendOffer(pc, key);
    }
  }, [createPeerConnection, sendOffer, shouldCreateOffer]);

  const startStream = useCallback(async () => {
    hasStartedStreamRef.current = true;

    try {
      await ensureLocalStream();
    } catch (error) {
      console.error("로컬 미디어를 가져오지 못했습니다:", error);
      hasStartedStreamRef.current = false;
      return;
    }

    if (!clientRef.current?.connected) {
      console.warn("시그널링 연결 전이라 로컬 스트림만 먼저 시작했습니다.");
      return;
    }

    await announceStreamStart();
  }, [announceStreamStart, ensureLocalStream]);

  const startScreenStream = useCallback(async () => {
    try {
      const localStream = await ensureLocalStream();
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const screenVideoTrack = screenStream.getVideoTracks()[0];
      const localVideoTrack = localStream.getVideoTracks()[0];

      if (!screenVideoTrack || !localVideoTrack) {
        return;
      }

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      screenStreamRef.current = screenStream;

      pcListMapRef.current.forEach((pc) => {
        const videoSender = pc
          .getSenders()
          .find((sender) => sender.track?.kind === "video");

        if (videoSender) {
          void videoSender.replaceTrack(screenVideoTrack);
        }
      });

      setRemoteStreams((prev) => {
        const alreadyExists = prev.some(
          (stream) => stream.id === screenStream.id,
        );
        return alreadyExists ? prev : [...prev, screenStream];
      });

      screenVideoTrack.onended = () => {
        removeRemoteStream(screenStream.id);

        pcListMapRef.current.forEach((pc) => {
          const videoSender = pc
            .getSenders()
            .find((sender) => sender.track?.kind === "video");

          if (videoSender) {
            void videoSender.replaceTrack(localVideoTrack);
          }
        });

        screenStream.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      };
    } catch (error) {
      console.error("화면 공유 중 오류 발생:", error);
      alert("화면 공유를 시작하는 데 실패했습니다. 권한을 확인하세요.");
    }
  }, [ensureLocalStream, removeRemoteStream]);

  useEffect(() => {
    const subscriptions: StompSubscription[] = [];
    const socket = new SockJS(SIGNALING_SERVER_URL);
    const pcMap = pcListMapRef.current;
    const pendingPeerConnections = pendingPeerConnectionRef.current;
    const peerStreamMap = peerStreamMapRef.current;
    const pendingIceCandidatesMap = pendingIceCandidatesRef.current;
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (value) => console.log(value),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      subscriptions.push(
        client.subscribe(
          `/topic/room/participants/${consultationRoomId}`,
          (message) => {
            const participantKeys = JSON.parse(message.body);

            if (!Array.isArray(participantKeys)) {
              return;
            }

            const nextOtherKeys = participantKeys.filter(
              (key): key is string => typeof key === "string" && key !== myKey,
            );

            otherKeyListRef.current = nextOtherKeys;

            for (const existingKey of Array.from(pcListMapRef.current.keys())) {
              if (!nextOtherKeys.includes(existingKey)) {
                cleanupPeerConnection(existingKey);
              }
            }

            if (!hasStartedStreamRef.current || !client.connected) {
              return;
            }

            nextOtherKeys.forEach((key) => {
              if (pcListMapRef.current.has(key) || !shouldCreateOffer(key)) {
                return;
              }

              void (async () => {
                const pc = await createPeerConnection(key);
                await sendOffer(pc, key);
              })();
            });
          },
        ),
      );

      subscriptions.push(
        client.subscribe(
          `/topic/peer/offer/${myKey}/${consultationRoomId}`,
          async (message) => {
            const { key, body } = JSON.parse(message.body);
            const pc = await createPeerConnection(key);

            await pc.setRemoteDescription(new RTCSessionDescription(body));
            await flushPendingIceCandidates(key);
            await sendAnswer(pc, key);
          },
        ),
      );

      subscriptions.push(
        client.subscribe(
          `/topic/peer/answer/${myKey}/${consultationRoomId}`,
          async (message) => {
            const { key, body } = JSON.parse(message.body);
            const pc = pcListMapRef.current.get(key);

            if (!pc) {
              return;
            }

            if (pc.signalingState !== "have-local-offer") {
              return;
            }

            await pc.setRemoteDescription(new RTCSessionDescription(body));
            await flushPendingIceCandidates(key);
          },
        ),
      );

      subscriptions.push(
        client.subscribe(
          `/topic/peer/iceCandidate/${myKey}/${consultationRoomId}`,
          async (message) => {
            const { key, body } = JSON.parse(message.body);
            await handleRemoteIceCandidate(key, body);
          },
        ),
      );

      client.publish({
        destination: `/app/room/join/${consultationRoomId}`,
        body: JSON.stringify(myKey),
      });

      if (hasStartedStreamRef.current) {
        void announceStreamStart();
      }
    };

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());

      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);

      Array.from(pcMap.keys()).forEach((key) => cleanupPeerConnection(key));
      pcMap.clear();
      pendingPeerConnections.clear();
      peerStreamMap.clear();
      pendingIceCandidatesMap.clear();
      otherKeyListRef.current = [];
      hasStartedStreamRef.current = false;
      setRemoteStreams([]);

      client.deactivate();
      clientRef.current = null;
    };
  }, [
    cleanupPeerConnection,
    createPeerConnection,
    flushPendingIceCandidates,
    handleRemoteIceCandidate,
    announceStreamStart,
    consultationRoomId,
    myKey,
    sendOffer,
    sendAnswer,
    shouldCreateOffer,
  ]);

  return {
    localStream,
    startStream,
    startScreenStream,
    remoteStreams,
  };
}
