'use client'
import { useLogin } from "@/app/business/hooks/useLogin";

interface LoginInputProps{
  email: string
  password: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void
}

export function LoginInput({email, password, onChange}:LoginInputProps){

  return (
    <>
    <input
      type='email'
      className="p-2.5 px-5 rounded-full w-full
        text-base cursor-pointer 
        bg-blue-100 text-black 
        hover:opacity-80 border-none"
      name="email"
      value={email}
      onChange={onChange}
      placeholder='email'
      required
    />
    <input 
      type='password'
      className="p-2.5 px-5 rounded-full w-full
        text-base cursor-pointer 
        bg-blue-100 text-black 
        hover:opacity-80 border-none" 
      name="password"
      value={password}
      onChange={onChange}
      placeholder='password'
      required
    />
    </>
  )
}

export function SubmitInput(){
    return (
      <input 
        type='submit'
        className="p-2.5 px-5 rounded-full w-full
          text-base cursor-pointer 
          bg-blue-500 text-white 
          hover:opacity-80 border-none" 
        value='submit'
        required
      />
    )
  }