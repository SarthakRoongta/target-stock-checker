'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

export default function SignInPage() {
  return (
    <Authenticator.Provider key="signin">
      <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black">
        <InnerSignIn />
      </div>
    </Authenticator.Provider>
  );
}

function InnerSignIn() {
  const { authStatus } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/dashboard');
    }
  }, [authStatus, router]);

  return (
    <Authenticator
      initialState="signIn"
      loginMechanisms={['username', 'email']}
      signUpAttributes={['email']}
      formFields={{
        signIn: {
          username: { label: 'Username or Email', placeholder: 'Enter your username or email' },
          password: { label: 'Password', placeholder: 'Enter your password' },
        },
      }}
      components={{
        Footer: () => (
          <p className="mt-4 text-center text-sm text-black dark:text-white">
            Don’t have an account?{' '}
            <Link href="/auth/signup" className="underline text-[#CC0000] hover:text-red-700">
              Sign up
            </Link>
          </p>
        ),
      }}
    />
  );
}
