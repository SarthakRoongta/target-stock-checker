'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect, useState } from 'react';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const screen = searchParams.get('screen');
  const initialState = screen === 'signup' ? 'signUp' : 'signIn';

  const { authStatus, route, toSignUp, toSignIn } = useAuthenticator();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      if (initialState === 'signUp') {
        router.push('/auth?screen=signin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [authStatus, initialState, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <Authenticator
        key={initialState} // force re-render on state switch
        initialState={initialState}
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
              {route === 'signIn' ? (
                <>
                  Don’t have an account?{' '}
                  <button
                    onClick={toSignUp}
                    className="text-[#CC0000] underline hover:text-red-700 transition"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={toSignIn}
                    className="text-[#CC0000] underline hover:text-red-700 transition"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          ),
        }}
      />
    </div>
  );
}
