'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import {
  Authenticator,
  useAuthenticator,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
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
  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  useEffect(() => {
    if (authStatus === 'authenticated' && user) {
      router.push('/signin'); // or '/dashboard' if you auto-login
    }
  }, [authStatus, user]);

  if (authStatus === 'authenticated') return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <Authenticator
        initialState="signUp"
        loginMechanisms={['username', 'email']}
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
