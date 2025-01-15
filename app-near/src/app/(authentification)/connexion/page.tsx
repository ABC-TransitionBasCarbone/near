import { Metadata } from 'next';
import { Suspense } from 'react';
import SignInForm from '~/app/_components/authentification/SignInForm';

export const metadata: Metadata = {
  title: 'Connexion',
  description: "Connectez vous à NEAR",
};

export default function SignIn(): JSX.Element {
  return (
    <Suspense fallback="Loading...">
      <SignInForm />
    </Suspense>
  );
}
