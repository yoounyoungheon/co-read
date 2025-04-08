import { APIResponseType, checkResponseStatus, instance } from "@/app/utils/http";
import { Article } from "./article.domain";
import { API_PATH } from "@/app/utils/http/api-path";

export const loadAllArticles = async ():Promise<APIResponseType<Article[]>> => {
  try {
    const response = await instance.post(`${API_PATH}/article/all`);
    checkResponseStatus(response.status);
    const result:Article[] = response.data;

    return {
      isSuccess: true,
      isFailure: false,
      data: result
    }
  } catch (error){
    return {
      isSuccess: false,
      isFailure: true,
      data: null,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}