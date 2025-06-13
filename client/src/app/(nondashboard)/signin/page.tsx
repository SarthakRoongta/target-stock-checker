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

export default function SignInPage() {
  const router = useRouter();
  const { authStatus } = useAuthenticator();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push('/dashboard');
    }
  }, [authStatus, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black">
      <Authenticator
        key="signin"
        initialState="signIn"
        components={{
          Footer: () => (
            <p className="text-center text-sm text-black dark:text-white mt-4">
              Don’t have an account?{' '}
              <Link
                href="/signup"
                className="text-[#CC0000] underline hover:text-red-700 transition"
              >
                Sign up here
              </Link>
            </p>
          ),
        }}
      />
    </div>
  );
}
