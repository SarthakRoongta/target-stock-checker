'use client';

import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css'; 
import '@aws-amplify/auth'; 

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_7wQXCCRFt',
      userPoolClientId: '44akf6lad1ma4n2rs83fehfkpb',
      loginWith: {
        username: true,
        email: false,
        phone: false,
      },
    },
  },
});

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return children;
}