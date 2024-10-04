import { useState } from "react";
import { transmitSignUpInfo } from "../../services/auth/auth.service";

export function useSignUp(){
  const [email, setEmail] = useState("");
  const [memberName, setMemberName] = useState("");
  const [password, setPassword] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    e.preventDefault();
    const {target:{ name, value }} = e;
    if(name === 'email'){
      setEmail(value);
    } else if (name == 'password') {
      setPassword(value);
    } else if (name == 'memberName') {
      setMemberName(value);
    }
  }

  const handleTranmition = (email: string, password: string) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('memberName', memberName);
    formData.append('password', password);
    transmitSignUpInfo(formData);
  }

  return{
    email,
    password,
    memberName,
    onChange,
    handleTranmition
  }
}