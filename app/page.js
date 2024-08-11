'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!session) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <div className="text-center">
          <img
            src={session.user.image}
            alt="Profile Picture"
            className="rounded-full w-24 h-24 mx-auto"
          />
          <h1 className="text-2xl font-semibold mt-4">{session.user.name}</h1>
          <p className="text-gray-600">{session.user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-6 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
