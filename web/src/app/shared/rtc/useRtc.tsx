import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";

interface UseRtcProps {
  id: string;
  myKey: string;
}

const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [
    {
      urls: "turn:13.125.215.188:3478",
      username: "splaw",
      credential: "splaw",
    },
  ],
};

export function useRtc({ id, myKey }: UseRtcProps) {
  const roomId = `${id}consulting`;

  const otherKeyListRef = useRef<string[]>([]);
  const pcListMapRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const peerStreamMapRef = useRef<Map<string, MediaStream>>(new Map());
  const pendingIceCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(
    new Map(),
  );
  const clientRef = useRef<Client | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

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
        destination: `/app/peer/iceCandidate/${otherKey}/${roomId}`,
        body: JSON.stringify({ key: myKey, body: event.candidate }),
      });
    },
    [myKey, roomId],
  );

  const createPeerConnection = useCallback(
    async (otherKey: string) => {
      const existingPc = pcListMapRef.current.get(otherKey);
      if (existingPc) {
        return existingPc;
      }

      const pc = new RTCPeerConnection(RTC_CONFIGURATION);
      const localStream = await ensureLocalStream();

      localStream.getTracks().forEach((track) => {
        const senderExists = pc
          .getSenders()
          .some((sender) => sender.track?.kind === track.kind);

        if (!senderExists) {
          pc.addTrack(track, localStream);
        }
      });

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

      pcListMapRef.current.set(otherKey, pc);

      return pc;
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
      const offer = await pc.createOffer();
      await setLocalDescription(pc, offer);

      clientRef.current?.publish({
        destination: `/app/peer/offer/${otherKey}/${roomId}`,
        body: JSON.stringify({ key: myKey, body: offer }),
      });
    },
    [myKey, roomId],
  );

  const sendAnswer = useCallback(
    async (pc: RTCPeerConnection, otherKey: string) => {
      const answer = await pc.createAnswer();
      await setLocalDescription(pc, answer);

      clientRef.current?.publish({
        destination: `/app/peer/answer/${otherKey}/${roomId}`,
        body: JSON.stringify({ key: myKey, body: answer }),
      });
    },
    [myKey, roomId],
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

  const startStream = useCallback(async () => {
    if (!clientRef.current?.connected) {
      return;
    }

    try {
      await ensureLocalStream();
    } catch (error) {
      console.error("로컬 미디어를 가져오지 못했습니다:", error);
      return;
    }

    clientRef.current.publish({
      destination: `/app/call/key`,
      body: "publish: call/key",
    });

    for (const key of otherKeyListRef.current) {
      if (pcListMapRef.current.has(key)) {
        continue;
      }

      const pc = await createPeerConnection(key);
      await sendOffer(pc, key);
    }
  }, [createPeerConnection, ensureLocalStream, sendOffer]);

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
        const alreadyExists = prev.some((stream) => stream.id === screenStream.id);
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
    const socket = new SockJS("https://mhsls.site/api/ws/consulting-room");
    const pcMap = pcListMapRef.current;
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
        client.subscribe(`/topic/call/key`, () => {
          client.publish({
            destination: `/app/send/key`,
            body: JSON.stringify(myKey),
          });
        }),
      );

      subscriptions.push(
        client.subscribe(`/topic/send/key`, (message) => {
          const key = JSON.parse(message.body);

          if (key !== myKey && !otherKeyListRef.current.includes(key)) {
            otherKeyListRef.current.push(key);
          }
        }),
      );

      subscriptions.push(
        client.subscribe(`/topic/peer/offer/${myKey}/${roomId}`, async (message) => {
          const { key, body } = JSON.parse(message.body);
          const pc = await createPeerConnection(key);

          await pc.setRemoteDescription(new RTCSessionDescription(body));
          await flushPendingIceCandidates(key);
          await sendAnswer(pc, key);
        }),
      );

      subscriptions.push(
        client.subscribe(`/topic/peer/answer/${myKey}/${roomId}`, async (message) => {
          const { key, body } = JSON.parse(message.body);
          const pc = pcListMapRef.current.get(key);

          if (!pc) {
            return;
          }

          await pc.setRemoteDescription(new RTCSessionDescription(body));
          await flushPendingIceCandidates(key);
        }),
      );

      subscriptions.push(
        client.subscribe(
          `/topic/peer/iceCandidate/${myKey}/${roomId}`,
          async (message) => {
            const { key, body } = JSON.parse(message.body);
            await handleRemoteIceCandidate(key, body);
          },
        ),
      );
    };

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());

      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;

      Array.from(pcMap.keys()).forEach((key) => cleanupPeerConnection(key));
      pcMap.clear();
      peerStreamMap.clear();
      pendingIceCandidatesMap.clear();
      otherKeyListRef.current = [];
      setRemoteStreams([]);

      client.deactivate();
      clientRef.current = null;
    };
  }, [
    cleanupPeerConnection,
    createPeerConnection,
    flushPendingIceCandidates,
    handleRemoteIceCandidate,
    myKey,
    roomId,
    sendAnswer,
  ]);

  return {
    startStream,
    startScreenStream,
    remoteStreams,
  };
}
