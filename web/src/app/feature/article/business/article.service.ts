"use server";
import { APIResponseType, checkResponseStatus } from "@/app/utils/http";
import { Article } from "./article.domain";
import { API_PATH } from "@/app/utils/http/api-path";
import { ArticleApiModel } from "./article.api-model";
import { mapArticleApiModelListToDomain } from "./article.mapper";

export const loadAllArticles = async (): Promise<
  APIResponseType<Article[]>
> => {
  try {
    const response = await fetch(`${API_PATH}/api/articles`, {
      cache: "no-store",
    });
    checkResponseStatus(response.status);

    const responseData = (await response.json()) as ArticleApiModel[];

    return {
      isSuccess: true,
      isFailure: false,
      data: mapArticleApiModelListToDomain(responseData),
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
