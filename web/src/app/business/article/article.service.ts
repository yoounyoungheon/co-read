"use server";
import { APIResponseType } from "@/app/utils/http";
import { Article } from "./article.domain";

export const loadAllArticles = async (): Promise<
  APIResponseType<Article[]>
> => {
  try {
    return {
      isSuccess: true,
      isFailure: false,
      data: [],
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
