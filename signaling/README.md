# Signaling Server

`web/src/app/shared/rtc/useRtc.tsx` uses `SockJS + STOMP` with these destinations:

- publish: `/app/call/key`
- publish: `/app/send/key`
- publish: `/app/peer/offer/:otherKey/:roomId`
- publish: `/app/peer/answer/:otherKey/:roomId`
- publish: `/app/peer/iceCandidate/:otherKey/:roomId`
- subscribe: `/topic/call/key`
- subscribe: `/topic/send/key`
- subscribe: `/topic/peer/offer/:myKey/:roomId`
- subscribe: `/topic/peer/answer/:myKey/:roomId`
- subscribe: `/topic/peer/iceCandidate/:myKey/:roomId`

This server keeps that contract unchanged.

## Run

```bash
cd signaling
npm install
npm run dev
```

## Env

- `PORT`
  - default: `8080`
- `CLIENT_ORIGIN`
  - default: `*`

## Endpoints

- health: `GET /health`
- sockjs: `/api/ws/consulting-room`

To use it locally, point the `SockJS(...)` URL in `useRtc.tsx` at your signaling server host.
