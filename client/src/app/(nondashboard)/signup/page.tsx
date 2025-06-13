'use client';

import { useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect } from 'react';
import Link from 'next/link';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

export default function SignUpPage() {
  const router = useRouter();
  const { authStatus } = useAuthenticator();

  useEffect(() => {
    // After sign up and auto-login, go to /signin instead of staying logged in
    if (authStatus === 'authenticated') {
      router.push('/signin');
    }
  }, [authStatus, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black">
      <Authenticator
        key="signUp"
        initialState="signUp"
        signUpAttributes={['email']}
        formFields={{
          signUp: {
            username: {
              label: 'Username',
              placeholder: 'Enter your username',
              isRequired: true,
            },
            email: {
              label: 'Email',
              placeholder: 'Enter your email',
              isRequired: true,
            },
            password: {
              label: 'Password',
              placeholder: 'Enter your password',
              isRequired: true,
            },
          },
        }}
        components={{
          Footer: () => (
            <p className="text-center text-sm text-black dark:text-white mt-4">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="text-[#CC0000] underline hover:text-red-700 transition"
              >
                Sign in here
              </Link>
            </p>
          ),
        }}
      />
    </div>
  );
}
