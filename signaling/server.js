const express = require("express");
const http = require("http");
const cors = require("cors");
const sockjs = require("sockjs");

const PORT = Number(process.env.PORT || 8080);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";
const WS_PREFIX = "/api/ws/consulting-room";

const app = express();
const server = http.createServer(app);
const sockServer = sockjs.createServer({
  prefix: WS_PREFIX,
  sockjs_url: "https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js",
});

let sessionSequence = 1;
let messageSequence = 1;

const connections = new Map();
const destinationSubscriptions = new Map();

app.use(
  cors({
    origin: CLIENT_ORIGIN === "*" ? true : CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    connections: connections.size,
    subscriptions: destinationSubscriptions.size,
  });
});

app.get("/", (_request, response) => {
  response.json({
    ok: true,
    message: "RTC signaling server is running.",
    websocketPath: WS_PREFIX,
  });
});

function createFrame(command, headers = {}, body = "") {
  const headerText = Object.entries(headers)
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");

  return `${command}\n${headerText}\n\n${body}\0`;
}

function parseFrame(frameText) {
  const normalizedFrame = frameText.replace(/\0$/, "");
  const separatorIndex = normalizedFrame.indexOf("\n\n");
  const head =
    separatorIndex >= 0
      ? normalizedFrame.slice(0, separatorIndex)
      : normalizedFrame;
  const body =
    separatorIndex >= 0 ? normalizedFrame.slice(separatorIndex + 2) : "";
  const lines = head.split("\n").filter(Boolean);
  const command = lines.shift();

  if (!command) {
    return null;
  }

  const headers = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(":");

    if (colonIndex < 0) {
      continue;
    }

    const key = line.slice(0, colonIndex);
    const value = line.slice(colonIndex + 1);
    headers[key] = value;
  }

  return {
    command,
    headers,
    body,
  };
}

function getMappedDestinations(destination) {
  if (destination === "/app/call/key") {
    return ["/topic/call/key"];
  }

  if (destination === "/app/send/key") {
    return ["/topic/send/key"];
  }

  const peerMatch = destination.match(
    /^\/app\/peer\/(offer|answer|iceCandidate)\/([^/]+)\/([^/]+)$/,
  );

  if (peerMatch) {
    const [, type, otherKey, roomId] = peerMatch;
    return [`/topic/peer/${type}/${otherKey}/${roomId}`];
  }

  return [];
}

function sendMessageFrame(connectionState, subscription, destination, body) {
  connectionState.connection.write(
    createFrame(
      "MESSAGE",
      {
        subscription: subscription.id,
        "message-id": `message-${messageSequence++}`,
        destination,
        "content-type": "application/json",
      },
      body,
    ),
  );
}

function addSubscription(connectionState, subscriptionId, destination) {
  const subscription = {
    id: subscriptionId,
    destination,
  };

  connectionState.subscriptions.set(subscriptionId, subscription);

  if (!destinationSubscriptions.has(destination)) {
    destinationSubscriptions.set(destination, new Set());
  }

  destinationSubscriptions.get(destination).add({
    sessionId: connectionState.sessionId,
    subscriptionId,
  });
}

function removeSubscription(connectionState, subscriptionId) {
  const subscription = connectionState.subscriptions.get(subscriptionId);

  if (!subscription) {
    return;
  }

  const subscribers = destinationSubscriptions.get(subscription.destination);

  if (subscribers) {
    for (const entry of subscribers) {
      if (
        entry.sessionId === connectionState.sessionId &&
        entry.subscriptionId === subscriptionId
      ) {
        subscribers.delete(entry);
        break;
      }
    }

    if (subscribers.size === 0) {
      destinationSubscriptions.delete(subscription.destination);
    }
  }

  connectionState.subscriptions.delete(subscriptionId);
}

function cleanupConnection(connectionState) {
  for (const subscriptionId of connectionState.subscriptions.keys()) {
    removeSubscription(connectionState, subscriptionId);
  }

  connections.delete(connectionState.sessionId);
}

function broadcast(destination, body) {
  const subscribers = destinationSubscriptions.get(destination);

  if (!subscribers) {
    return;
  }

  for (const subscriber of subscribers) {
    const connectionState = connections.get(subscriber.sessionId);
    const subscription = connectionState?.subscriptions.get(
      subscriber.subscriptionId,
    );

    if (!connectionState || !subscription) {
      continue;
    }

    sendMessageFrame(connectionState, subscription, destination, body);
  }
}

function handleConnect(connectionState) {
  connectionState.connected = true;

  connectionState.connection.write(
    createFrame("CONNECTED", {
      version: "1.2",
      "heart-beat": "0,0",
      session: connectionState.sessionId,
    }),
  );
}

function handleSend(frame) {
  const destination = frame.headers.destination;

  if (!destination) {
    return;
  }

  const targets = getMappedDestinations(destination);

  for (const target of targets) {
    broadcast(target, frame.body);
  }
}

function handleSubscribe(connectionState, frame) {
  const destination = frame.headers.destination;
  const subscriptionId = frame.headers.id;

  if (!destination || !subscriptionId) {
    return;
  }

  addSubscription(connectionState, subscriptionId, destination);
}

function handleFrame(connectionState, frame) {
  switch (frame.command) {
    case "CONNECT":
    case "STOMP":
      handleConnect(connectionState);
      return;
    case "SUBSCRIBE":
      handleSubscribe(connectionState, frame);
      return;
    case "UNSUBSCRIBE":
      if (frame.headers.id) {
        removeSubscription(connectionState, frame.headers.id);
      }
      return;
    case "SEND":
      handleSend(frame);
      return;
    case "DISCONNECT":
      connectionState.connection.close();
      return;
    default:
      return;
  }
}

sockServer.on("connection", (connection) => {
  const sessionId = `session-${sessionSequence++}`;
  const connectionState = {
    sessionId,
    connection,
    connected: false,
    subscriptions: new Map(),
    buffer: "",
  };

  connections.set(sessionId, connectionState);

  connection.on("data", (chunk) => {
    if (chunk === "\n") {
      return;
    }

    connectionState.buffer += chunk;

    while (connectionState.buffer.includes("\0")) {
      const terminatorIndex = connectionState.buffer.indexOf("\0");
      const frameText = connectionState.buffer.slice(0, terminatorIndex + 1);
      connectionState.buffer = connectionState.buffer.slice(terminatorIndex + 1);

      const frame = parseFrame(frameText);

      if (frame) {
        handleFrame(connectionState, frame);
      }
    }
  });

  connection.on("close", () => {
    cleanupConnection(connectionState);
  });
});

sockServer.installHandlers(server, {
  prefix: WS_PREFIX,
});

server.listen(PORT, () => {
  console.log(
    `[signaling] listening on http://localhost:${PORT} (sockjs: ${WS_PREFIX})`,
  );
});
