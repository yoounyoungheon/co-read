export type BuildStage = "SCM" | "BUILD" | "DEPLOY";

export type BuildProgressEventPayload = {
  type: BuildStage;
  delta: string;
  length: number;
};

export type BuildEndEventPayload = {
  success: boolean;
  message: string;
};
