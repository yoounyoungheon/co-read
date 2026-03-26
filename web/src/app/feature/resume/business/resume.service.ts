"use server";

import type { TimeLineItem } from "@/app/feature/resume/ui/TimeLine";
import { APIResponseType, checkResponseStatus } from "@/app/utils/http";
import { API_PATH } from "@/app/utils/http/api-path";
import { convertResumeToTimeLineItems } from "./resume.convert";
import { createResumeDomain, Resume } from "./resume.domain";

export const loadResumeForGuestRequest = async (): Promise<
  APIResponseType<Resume>
> => {
  try {
    const response = await fetch(`${API_PATH}/api/resume`, {
      cache: "no-store",
    });
    checkResponseStatus(response.status);

    const responseData = await response.json();
    const resume = createResumeDomain(responseData.items);

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

export const loadResumeTimeLineItemsForGuestRequest = async (): Promise<
  APIResponseType<TimeLineItem[]>
> => {
  const response = await loadResumeForGuestRequest();

  if (response.isFailure || response.data === null) {
    return {
      isSuccess: false,
      isFailure: true,
      data: null,
      message: response.message,
    };
  }

  return {
    isSuccess: true,
    isFailure: false,
    data: convertResumeToTimeLineItems(response.data),
  };
};
