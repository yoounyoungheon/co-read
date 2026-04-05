"use server";
import { APIResponseType, checkResponseStatus } from "@/app/utils/http";
import { API_PATH } from "@/app/utils/http/api-path";
import { Project } from "./project.domain";
import { ProjectApiModel } from "./project.api-model";
import {
  mapProjectApiModelListToDomain,
  mapProjectApiModelToDomain,
} from "./project.mapper";

export const loadProjectsForGuestRequest = async (): Promise<
  APIResponseType<Project[]>
> => {
  try {
    const response = await fetch(`${API_PATH}/api/projects`, {
      cache: "no-store",
    });
    checkResponseStatus(response.status);

    const responseData = (await response.json()) as ProjectApiModel[];

    return {
      isSuccess: true,
      isFailure: false,
      data: mapProjectApiModelListToDomain(responseData),
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

export const loadProjectForGuestRequest = async (
  id: string,
): Promise<APIResponseType<Project>> => {
  try {
    const response = await fetch(`${API_PATH}/projects/${id}.json`, {
      cache: "no-store",
    });
    checkResponseStatus(response.status);
    const responseData = (await response.json()) as ProjectApiModel;
    const project = mapProjectApiModelToDomain(responseData);

    return {
      isSuccess: true,
      isFailure: false,
      data: project,
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
