'use client'
import { Card, CardContent, CardFooter } from '@/app/ui/components/view/molecule/card/card'
import Form from '@/app/ui/components/view/molecule/form';
import { transmitSignUpInfo } from '@/app/business/services/auth/auth.service';
import HanaLogo from '@/app/ui/components/view/atom/logo';

export default function SignUp() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
      <div className="flex flex-col justify-center items-center text-center">
        <HanaLogo/>
      </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          환영합니다! 푸줏간입니다.
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