'use server';
import { API_PATH } from "@/app/store/queries/api-path";
import { SignInFormSchema, SignInRequestBody, SignUpFormSchema, SignUpRequestBody } from "./auth-validation.service";
import { HttpError } from "@/app/utils/http/http-error";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

interface FormState {
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  validationError: Record<string, string[] | undefined>;
};

export async function transmitSignUpInfo(formData: FormData): Promise<FormState>{
  // validation for "zod parse"
  const validatedFields = SignUpFormSchema.safeParse({
    memberName: formData.get('memberName'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if(!validatedFields.success) {
    return {
      isSuccess: false,
      isFailure: true,
      validationError: validatedFields.error.flatten().fieldErrors,
      message: '유효하지 않은 입력입니다. 다시 입력해주세요.'
    }
  }

  const body: SignUpRequestBody = {
    ...validatedFields.data,
  };

  try{
    const response = await fetch(`${API_PATH.auth}/sign-up`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(body),
    })

    console.log(response);
    console.log("회원가입에 성공했습니다.");
    
  } catch (error){
    console.log(error);
    if(error instanceof HttpError && error.statusCode === 404){
      return {
        isSuccess: false,
        isFailure: true,
        validationError: {},
        message: '회원가입에 실패했습니다. 아이디, 이름, 비밀번호가 올바른지 확인해주세요',
      }
    }
    throw error;
  } finally {
    redirect('/');
  }
 }

export async function authenticate(formData: FormData): Promise<FormState>{
  // validation for "zod parse"
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if(!validatedFields.success) {
    return {
      isSuccess: false,
      isFailure: true,
      validationError: validatedFields.error.flatten().fieldErrors,
      message: '유효하지 않은 입력입니다. 다시 입력해주세요.'
    }
  }

  const body: SignInRequestBody = {
    ...validatedFields.data,
  };

  try{
    const response = await fetch(`${API_PATH.auth}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(body),
    });
    console.log(response);
    console.log("로그인에 성공했습니다.");

    if (!response.ok) {
      throw new HttpError(response.status, '서버 에러');
    }
    
    const result = await response.json();

    cookies().set('accessToken', result.accessToken, {
      secure: true,
      path: '/',
    });
  } catch(error){
    console.log(error);
    if(error instanceof HttpError && error.statusCode === 404){
      return {
        isSuccess: false,
        isFailure: true,
        validationError: {},
        message: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요',
      }
    }
    throw error;
  } finally {
    redirect('/');
  }
};