export type PairingChunkType = "TITLE" | "COMMENT" | "REASON";

export type ChatSSEEvent =
  | {
      type: "CHAT";
      data: {
        content: string;
      };
    }
  | {
      type: "START";
      data: {
        type: "MESSAGE";
        message: string;
      };
    }
  | {
      type: "PAIRING";
      data: {
        type: PairingChunkType;
        rank: number;
        content: string;
      };
    }
  | {
      type: "FINISH";
      data: null;
    };
