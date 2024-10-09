// import { SignInInput, SignUpInput, SubmitInput } from "./auth-input";
// import { useSignIn } from "@/app/business/hooks/auth/use-sign-in.hook";
// import { useSignUp } from "@/app/business/hooks/auth/legacy/use-sign-up.hook";
// import { useRouter } from "next/navigation"; 

// export function SignInForm() {
//   const router = useRouter();
//   const {email, password, onChange, handleAuthentication} = useSignIn();

//   return (
//     <form className="mt-12 mb-2 flex flex-col gap-2.5 w-full" onSubmit={async (event) => {
//       event.preventDefault();
//       const result = await handleAuthentication(email, password);
//       console.log(result)
//       if (result) {
//         router.push("/routes/main-board");
//       }
//     }}>
//       <SignInInput email={email} password={password} onChange={onChange}/>
//       <SubmitInput content='Sign In'/>
//     </form>
//   );
// }

// export function SignUpForm() {
//   const router = useRouter();
//   const {email, password, onChange, memberName, handleTransmition} = useSignUp();
//   return (
//     <form className="mt-12 mb-2 flex flex-col gap-2.5 w-full" onSubmit={async (event) => {
//       event.preventDefault();
//       const result = await handleTransmition(email, password, memberName);
//       console.log(result)
//       if (result) {
//         router.push("/");
//       }
//     }}>
//       <SignUpInput email={email} password={password} onChange={onChange}/>
//       <SubmitInput content='Sign Up'/>
//     </form>
//   );
// }