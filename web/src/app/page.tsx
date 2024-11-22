'use client'
import { Card, CardContent, CardFooter } from './ui/components/view/molecule/card/card';
import Form from './ui/components/view/molecule/form';
import { authenticate } from './business/services/auth/auth.service';
import Link from 'next/link';
import Logo from './ui/components/view/atom/logo';
// import { useRouter } from 'next/navigation';
export default function Home() {
  // const router = useRouter();
  // router.push("/routes/main-board");
  return (
  <main className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col justify-center items-center text-center">
        <Logo/>
      </div>
      <Card>
        <Form id="sign-in" action={authenticate} failMessageControl={'alert'}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Form.TextInput label="Email" id="email" placeholder="m@example.com" />
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
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Dont have an account?
          <Link className="font-medium hover:underline" href="/sign-up">
            Register
          </Link>
        </div>
    </div>
  </main>
  );
}