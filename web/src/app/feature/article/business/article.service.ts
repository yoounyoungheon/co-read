"use server";
import { APIResponseType, checkResponseStatus } from "@/app/utils/http";
import { Article } from "./article.domain";
import { API_PATH } from "@/app/utils/http/api-path";

export const loadAllArticles = async (): Promise<
  APIResponseType<Article[]>
> => {
  try {
    const response = await fetch(`${API_PATH}/api/articles`, {
      cache: "no-store",
    });
    checkResponseStatus(response.status);

    return {
      isSuccess: true,
      isFailure: false,
      data: await response.json(),
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
