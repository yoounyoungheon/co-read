import {
  PlayGroundCardViewModel,
  PLAY_GROUND_ROUTE_TYPE,
  PlayGroundRouteType,
} from "./play-ground.view-model";

type PlayGroundCardDefinition = {
  title: string;
  description: string;
  routeType: PlayGroundRouteType;
};

const PLAY_GROUND_CARD_DEFINITIONS: PlayGroundCardDefinition[] = [
  {
    title: "AI Chat Streaming",
    description:
      "AI가 응답하는 스트리밍 데이터를 채팅 UI로 구현한 플레이그라운드입니다.",
    routeType: PLAY_GROUND_ROUTE_TYPE.AI_CHAT_STREAMING,
  },
  {
    title: "Log Streaming",
    description:
      "로그성 데이터의 실시간 스트리밍을 제공하는 플레이그라운드입니다.",
    routeType: PLAY_GROUND_ROUTE_TYPE.LOG_STREAMING,
  },
  {
    title: "Code Gen Streaming",
    description:
      "코드 생성 상태와 최종 결과를 SSE로 확인할 수 있는 플레이그라운드입니다.",
    routeType: PLAY_GROUND_ROUTE_TYPE.CODE_GEN_STREAM,
  },
  {
    title: "WEB RTC",
    description:
      "WEB RTC를 활용한 실시간 통신을 제공하는 플레이그라운드입니다.",
    routeType: PLAY_GROUND_ROUTE_TYPE.WEB_RTC,
  },
  {
    title: "CSS ONLY",
    description:
      "JS없이 상태가 존재하는 컴포넌트 예시를 제공하는 플레이그라운드입니다.",
    routeType: PLAY_GROUND_ROUTE_TYPE.CSS_ONLY,
  },
];

const createPlayGroundPath = (routeType: PlayGroundRouteType) => {
  if (routeType === PLAY_GROUND_ROUTE_TYPE.WEB_RTC) {
    return `/play-ground?type=${routeType}&id=${crypto.randomUUID()}`;
  }

  return `/play-ground?type=${routeType}`;
};

export const presentPlayGroundCards = (): PlayGroundCardViewModel[] => {
  return PLAY_GROUND_CARD_DEFINITIONS.map((item) => ({
    type: item.title,
    description: item.description,
    path: createPlayGroundPath(item.routeType),
  }));
};
