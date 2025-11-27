"use server";
import { APIResponseType } from "@/app/utils/http";
import { createProfileDomain, Profile } from "./profile.domain";

export const loadProfileForGuestRequest = async (): Promise<
  APIResponseType<Profile>
> => {
  try {
    return {
      isSuccess: true,
      isFailure: false,
      data: createProfileDomain(
        "1",
        "1",
        "HI",
        ["안녕하세요, 프론트엔드 개발자 윤영헌입니다."],
        "https://github.com/yoounyoungheon",
        "https://younghun123.tistory.com/"
      ),
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
