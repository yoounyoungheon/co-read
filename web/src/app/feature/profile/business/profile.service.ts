"use server";
import { APIResponseType } from "@/app/utils/http";
import { Profile } from "./profile.domain";
import { ProfileApiModel } from "./profile.api-model";
import { mapProfileApiModelToDomain } from "./profile.mapper";

export const loadProfileForGuestRequest = async (): Promise<
  APIResponseType<Profile>
> => {
  try {
    const profileApiModel: ProfileApiModel = {
      id: "1",
      userId: "1",
      introduce:
        "안녕하세요! 개발자 윤영헌입니다.\n융합소프트웨어와 경영학을 전공했습니다.\n비즈니스, 기술적 관점에서 변화에 유연한 소프트웨어 설계를 고민합니다.\n\n해당 웹 앱 github: https://github.com/yoounyoungheon/co-read\n",
      words: ["Dongguk Univ · scsc & biz", "Open Labs · 2025 ~"],
      gitUrl: "https://github.com/yoounyoungheon/co-read",
      blogUrl: "https://younghun123.tistory.com/",
    };

    return {
      isSuccess: true,
      isFailure: false,
      data: mapProfileApiModelToDomain(profileApiModel),
    };
  } catch (error) {
    return {
      isSuccess: false,
      isFailure: true,
      data: null,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};
