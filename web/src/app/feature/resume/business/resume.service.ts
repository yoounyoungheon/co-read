"use server";

import { APIResponseType, checkResponseStatus } from "@/app/utils/http";
import { API_PATH } from "@/app/utils/http/api-path";
import { Resume } from "./resume.domain";
import { ResumeApiModel } from "./resume.api-model";
import { mapResumeApiModelToDomain } from "./resume.mapper";

export const loadResumeForGuestRequest = async (): Promise<
  APIResponseType<Resume>
> => {
  try {
    const response = await fetch(`${API_PATH}/api/resume`, {
      cache: "no-store",
    });
    checkResponseStatus(response.status);

    const responseData = (await response.json()) as ResumeApiModel;
    const resume = mapResumeApiModelToDomain(responseData);

    return {
      isSuccess: true,
      isFailure: false,
      data: resume,
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
