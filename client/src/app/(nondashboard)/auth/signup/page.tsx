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

export default function SignUpPage() {
  return (
    <Authenticator.Provider key="signup">
      <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black">
        <InnerSignUp />
      </div>
    </Authenticator.Provider>
  );
}

function InnerSignUp() {
  const { authStatus } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/auth/signin');
    }
  }, [authStatus, router]);

  return (
    <Authenticator
      initialState="signUp"
      loginMechanisms={['username', 'email']}
      signUpAttributes={['email']}
      formFields={{
        signUp: {
          username: { label: 'Username', placeholder: 'Choose a username', isRequired: true },
          email:    { label: 'Email',    placeholder: 'Enter your email',    isRequired: true },
          password: { label: 'Password', placeholder: 'Create a password',    isRequired: true },
        },
      }}
      components={{
        Footer: () => (
          <p className="mt-4 text-center text-sm text-black dark:text-white">
            Already have an account?{' '}
            <Link href="/auth/signin" className="underline text-[#CC0000] hover:text-red-700">
              Sign in
            </Link>
          </p>
        ),
      }}
    />
  );
}
