import { useState } from "react";

export function useLogin(){
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
  return{
    email,
    password,
    onChange
  }
}