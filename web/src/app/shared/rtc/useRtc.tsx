import { useEffect, useRef, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface UseRtcProps {
  id: string;
  myKey: string;
}

export function useRtc({ id, myKey }: UseRtcProps) {
  const roomId = `${id}consulting`;

  const otherKeyListRef = useRef<string[]>([]);
  const pcListMapRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const clientRef = useRef<Client | null>(null);

  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const onIceCandidate = useCallback(
    (event: RTCPeerConnectionIceEvent, otherKey: string) => {
      const pc = pcListMapRef.current.get(otherKey);
      if (pc && event.candidate && clientRef.current?.connected) {
        clientRef.current.publish({
          destination: `/app/peer/iceCandidate/${otherKey}/${roomId}`,
          body: JSON.stringify({ key: myKey, body: event.candidate }),
        });
      }
    },
    [myKey, roomId],
  );

  const onTrack = useCallback((event: RTCTrackEvent) => {
    const stream = event.streams[0];
    if (stream) {
      setRemoteStreams((prev) => {
        const alreadyExists = prev.some((s) => s.id === stream.id);
        return alreadyExists ? prev : [...prev, stream];
      });
    }
  }, []);

  const createPeerConnection = useCallback(
    async (otherKey: string) => {
      const iceServers = [
        {
          urls: "turn:13.125.215.188:3478",
          username: "splaw",
          credential: "splaw",
        },
      ];

      const pc = new RTCPeerConnection({ iceServers });

      pc.onicecandidate = (e) => onIceCandidate(e, otherKey);
      pc.ontrack = onTrack;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onconnectionstatechange = () => {
          if (
            ["disconnected", "failed", "closed"].includes(pc.iceConnectionState)
          ) {
            console.log("연결이 끊어졌습니다.");
          }
        };
      } catch (err) {
        console.error("getUserMedia 오류:", err);
      }

      return pc;
    },
    [onIceCandidate, onTrack],
  );

  const setLocalAndSendMessage = async (
    pc: RTCPeerConnection,
    desc: RTCLocalSessionDescriptionInit,
  ) => {
    await pc.setLocalDescription(desc);
  };

  const sendOffer = async (pc: RTCPeerConnection, otherKey: string) => {
    const offer = await pc.createOffer();
    await setLocalAndSendMessage(pc, offer);
    clientRef.current?.publish({
      destination: `/app/peer/offer/${otherKey}/${roomId}`,
      body: JSON.stringify({ key: myKey, body: offer }),
    });
  };

  const startStream = async () => {
    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: `/app/call/key`,
      body: "publish: call/key",
    });

    for (const key of otherKeyListRef.current) {
      if (!pcListMapRef.current.has(key)) {
        const pc = await createPeerConnection(key);
        pcListMapRef.current.set(key, pc);
        await sendOffer(pc, key);
      }
    }
  };

  const startScreenStream = async () => {
    try {
      console.log("화면 공유 시작");

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      pcListMapRef.current.forEach((pc) => {
        const videoSender = pc
          .getSenders()
          .find((sender) => sender.track?.kind === "video");

        if (videoSender) {
          videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        } else {
          pc.addTrack(screenStream.getVideoTracks()[0], screenStream);
        }
      });

      setRemoteStreams((prev) => [...prev, screenStream]);

      screenStream.getVideoTracks()[0].onended = () => {
        console.log("화면 공유가 종료되었습니다.");

        setRemoteStreams((prev) =>
          prev.filter((s) => s.id !== screenStream.id),
        );

        if (screenStream) {
          screenStream.getTracks().forEach((track) => track.stop());

          pcListMapRef.current.forEach(async (pc) => {
            const videoSender = pc
              .getSenders()
              .find((sender) => sender.track?.kind === "video");
            if (videoSender) {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              });
              videoSender.replaceTrack(stream.getVideoTracks()[0]);
            }
          });
        }
      };
    } catch (error) {
      console.error("화면 공유 중 오류 발생:", error);
      alert("화면 공유를 시작하는 데 실패했습니다. 권한을 확인하세요.");
    }
  };

  useEffect(() => {
    const socket = new SockJS(`https://mhsls.site/api/ws/consulting-room`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    const sendAnswer = async (pc: RTCPeerConnection, otherKey: string) => {
      const answer = await pc.createAnswer();
      await setLocalAndSendMessage(pc, answer);
      clientRef.current?.publish({
        destination: `/app/peer/answer/${otherKey}/${roomId}`,
        body: JSON.stringify({ key: myKey, body: answer }),
      });
    };

    client.onConnect = () => {
      client.subscribe(`/topic/call/key`, () => {
        client.publish({
          destination: `/app/send/key`,
          body: JSON.stringify(myKey),
        });
      });

      client.subscribe(`/topic/send/key`, (message) => {
        const key = JSON.parse(message.body);
        if (key !== myKey && !otherKeyListRef.current.includes(key)) {
          otherKeyListRef.current.push(key);
        }
      });

      client.subscribe(
        `/topic/peer/offer/${myKey}/${roomId}`,
        async (message) => {
          const { key, body } = JSON.parse(message.body);
          const pc = await createPeerConnection(key);
          pcListMapRef.current.set(key, pc);
          await pc.setRemoteDescription(new RTCSessionDescription(body));
          await sendAnswer(pc, key);
        },
      );

      client.subscribe(
        `/topic/peer/answer/${myKey}/${roomId}`,
        async (message) => {
          const { key, body } = JSON.parse(message.body);
          const pc = pcListMapRef.current.get(key);
          if (pc)
            await pc.setRemoteDescription(new RTCSessionDescription(body));
        },
      );

      client.subscribe(
        `/topic/peer/iceCandidate/${myKey}/${roomId}`,
        async (message) => {
          setTimeout(async () => {
            const { key, body } = JSON.parse(message.body);
            const pc = pcListMapRef.current.get(key);
            if (pc) {
              await pc.addIceCandidate(new RTCIceCandidate(body));
            }
          }, 3000);
        },
      );
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [myKey, roomId, createPeerConnection]);

  return {
    startStream,
    startScreenStream,
    remoteStreams,
  };
}
