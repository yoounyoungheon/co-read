'use client'
import { Card, CardContent, CardFooter } from '@/app/ui/components/view/molecule/card/card'
import Form from '@/app/ui/components/view/molecule/form';
import { transmitSignUpInfo } from '@/app/business/services/auth/auth.service';
// import { useRouter } from 'next/navigation';

export default function SignUp() {
  // const router = useRouter();
  // router.push("/");
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Sign UP</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Welcome to CO-READ !
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          below to sign up
        </p>
      </div>
      <Card>
        <Form id="sign-in" action={transmitSignUpInfo} failMessageControl={'alert'}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Form.TextInput label="Email" id="email" placeholder="xxx@example.com" />
            </div>
            <div className="space-y-2">
              <Form.TextInput label="Name" id="memberName" placeholder="" />
            </div>
            <div className="space-y-2">
              <Form.PasswordInput label="Password" id="password" placeholder="" />
            </div>
          </CardContent>
          <CardFooter>
            <Form.SubmitButton label="Sign in" position="center" className="w-full" />
          </CardFooter>
        </Form>
      </Card>
    </div>
  </main>
  );
}