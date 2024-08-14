'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaTimes } from 'react-icons/fa'; // Importing user icon and close icon

export default function Profile() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false); // State to manage the visibility of the profile box
  const router = useRouter();

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/signin');
  };

  return (
    <div className="relative">
      {/* Profile Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 text-3xl text-gray-800 focus:outline-none"
      >
        <FaUserCircle />
      </button>

      {/* Profile Box */}
      {isOpen && (
        <div className="fixed top-16 right-4 bg-white shadow-lg border border-gray-200 rounded-lg p-6 z-60">
          <div className="flex items-center justify-between mb-4">
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
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
              <FaTimes />
            </button>
          </div>
          <button
            onClick={handleSignOut}
            className="py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors w-full"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
