import { useState } from "react";
import { authenticate } from "../../services/auth/auth.service";

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

  const handleAuthentication = async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('email', email)
    formData.append('password', password);
    const result = await authenticate(formData);
    return result.isSuccess;
  }

  return{
    email,
    password,
    onChange,
    handleAuthentication
  }
}