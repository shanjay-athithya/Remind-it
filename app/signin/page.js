'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // If the user is already signed in, redirect to the homepage
  if (session) {
    router.push('/');
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Full Page Background Image */}
      <Image 
        src="/assets/a4.jpg"  // Path to your background image
        alt="Background"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        className="absolute inset-0 z-0"
      />

      {/* Centered Sign-In Form with Blur Background */}
      <div className="relative flex items-center justify-center min-h-screen">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
        
        {/* Sign-In Form */}
        <div className="relative bg-black bg-opacity-70 shadow-lg rounded-lg p-16 max-w-md w-full text-center z-10 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold mb-10 text-red-700">Remind it!</h1>
          <button
            onClick={() => signIn('google')}
            className="w-2/3 py-3 bg-white text-black font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-red-600 text-lg" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
