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

export default function SignInPage() {
  const router = useRouter();
  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  useEffect(() => {
    if (authStatus === 'authenticated' && user) {
      router.push('/dashboard');
    }
  }, [authStatus, user, router]);


  // ✅ Don't show login UI if user already authenticated
  if (authStatus === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <Authenticator
        initialState="signIn"
        loginMechanisms={['username', 'email']}
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
