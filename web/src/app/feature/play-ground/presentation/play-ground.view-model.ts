export const PLAY_GROUND_ROUTE_TYPE = {
  AI_CHAT_STREAMING: "AI_CHAT_STREAMING",
  LOG_STREAMING: "LOG_STREAMING",
  CODE_GEN_STREAM: "CODE_GEN_STREAM",
  WEB_RTC: "WEB_RTC",
  CSS_ONLY: "CSS_ONLY",
} as const;

export type PlayGroundRouteType =
  (typeof PLAY_GROUND_ROUTE_TYPE)[keyof typeof PLAY_GROUND_ROUTE_TYPE];

export interface PlayGroundCardViewModel {
  type: string;
  description: string;
  path: string;
}
