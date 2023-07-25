import '@/styles/globals.css';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import type { AppProps } from 'next/app';

Amplify.configure(awsconfig);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
