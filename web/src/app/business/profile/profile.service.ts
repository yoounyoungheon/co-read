'use server'
import { APIResponseType, checkResponseStatus, instance } from "@/app/utils/http";
import { createProfileDomain, Profile } from "./profile.domain";
import { API_PATH } from "@/app/utils/http/api-path";

export const loadProfileForGuestRequest = async ():Promise<APIResponseType<Profile>> => {
  const response = await instance.get(`${API_PATH}/profile/guest`);
  checkResponseStatus(response.status);
  const responseData = response.data;
  
  try {
    return {
      isSuccess: true,
      isFailure: false,
      data: createProfileDomain(
        responseData.id, 
        responseData.userId, 
        responseData.introduce, 
        responseData.words, 
        responseData.gitUrl, 
        responseData.blogUrl
      ),
    }
  } catch (error) {
    return {
      isSuccess: false,
      isFailure: true,
      data: null,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}