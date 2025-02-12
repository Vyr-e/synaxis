import { SignInForm } from './sign-in.form';
import { SignUpForm } from './sign-up.form';

type AuthFormProps = {
  type: 'sign-in' | 'sign-up';
};

export function AuthForm({ type }: AuthFormProps) {
  return type === 'sign-in' ? <SignInForm /> : <SignUpForm />;
}
