import { useState } from "react";
import { authenticate } from "../services/auth/auth.service";

export function useSignIn(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    e.preventDefault();
    const {target:{ name, value }} = e;
    if(name === 'email'){
      setEmail(value);
    } else if (name == 'password') {
      setPassword(value);
    }
  }

  const handleAuthentication = (email: string, password: string) => {
    const formData = new FormData();
    formData.append('email', email)
    formData.append('password', password);
    authenticate(formData);
  }

  return{
    email,
    password,
    onChange,
    handleAuthentication
  }
}