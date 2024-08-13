'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!session) {
    return null; // Redirect or handle unauthenticated state if needed
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/signin'); // Redirect to sign-in page after sign out
  };

  return (
    <div className="bg-white shadow-md py-4 px-6 rounded-lg flex items-center justify-between mb-8 border border-gray-200">
      <div className="flex items-center">
        <img
          src={session.user.image}
          alt="Profile Picture"
          className="rounded-full w-16 h-16 border-4 border-gray-300 shadow-lg"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-semibold text-gray-800">{session.user.name}</h1>
          <p className="text-gray-600">{session.user.email}</p>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
