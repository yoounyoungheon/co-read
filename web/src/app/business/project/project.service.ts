'use server'
import { APIResponseType, checkResponseStatus } from "@/app/utils/http"
import { API_PATH } from "@/app/utils/http/api-path"
import { createProjectDomain, Project } from "./project.domain";
import { UserInterface } from "./user-interface.domain";

interface LoadProjectResponse {
  id: string;
  userId: string;
  title: string;
  description: string[];
  thinks: string[];
  beTechs: string[];
  feTechs: string[];
  infraTechs: string[];
  startDate: string;
  endDate: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const loadUserInterfaceRequest = async (projectId: string):Promise<APIResponseType<UserInterface[]>> => {
  try {
    const response = await fetch(`${API_PATH}/user-interface/project/${projectId}`,
      { cache: 'no-store' }
    )
    checkResponseStatus(response.status);

    const responseData: UserInterface[] = await response.json();
    return {
      isSuccess: true,
      isFailure: false,
      data: responseData
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

export const loadProjectsForGuestRequest = async ():Promise<APIResponseType<Project[]>> => {
  try {
    const response = await fetch(`${API_PATH}/project`,
      { cache: 'no-store' }
    )
    checkResponseStatus(response.status);

    const responseData = await response.json();
    const projects = responseData.map((project: LoadProjectResponse) => {
      return createProjectDomain(
        project.id,
        project.userId,
        project.title,
        project.description,
        project.thinks,
        project.beTechs,
        project.feTechs,
        project.infraTechs,
        new Date(project.startDate),
        new Date(project.endDate),
        project.imageUrl,
        project.createdAt,
        project.updatedAt
      )
    })
    return {
      isSuccess: true,
      isFailure: false,
      data: projects,
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

export const loadProjectForGuestRequest = async (id: string):Promise<APIResponseType<Project>> => {
  try {
    const response = await fetch(`${API_PATH}/project/${id}`,
      { cache: 'no-store' }
    );
    checkResponseStatus(response.status);
    const responseData: LoadProjectResponse = await response.json();

    const project =  createProjectDomain(
      responseData.id,
      responseData.userId,
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
      responseData.updatedAt,
    )

    return {
      isSuccess: true,
      isFailure: false,
      data: project,
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