"use server";
import { APIResponseType, checkResponseStatus } from "@/app/utils/http";
import { API_PATH } from "@/app/utils/http/api-path";
import { createProjectDomain, Project } from "./project.domain";
import { UserInterface } from "./user-interface.domain";

export const loadUserInterfaceRequest = async (
  projectId: string
): Promise<APIResponseType<UserInterface[]>> => {
  try {
    console.log("loadUserInterfaceRequest projectId", projectId);

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

export const loadProjectsForGuestRequest = async (): Promise<
  APIResponseType<Project[]>
> => {
  try {
    const response = await fetch(`${API_PATH}/api/projects`, {
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

export const loadProjectForGuestRequest = async (
  id: string
): Promise<APIResponseType<Project>> => {
  try {
    const response = await fetch(`${API_PATH}/projects/${id}.json`, {
      cache: "no-store",
    });
    checkResponseStatus(response.status);
    const responseData = await response.json();

    const project = createProjectDomain(
      responseData.id,
      responseData.title,
      responseData.description,
      responseData.thinks,
      responseData.beTechs,
      responseData.feTechs,
      responseData.infraTechs,
      new Date(responseData.startDate),
      new Date(responseData.endDate),
      responseData.imageUrl,
      responseData.createdAt,
      responseData.updatedAt
    );

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
