// components/ProfileCard.js

import Image from 'next/image';

export default function ProfileCard({ user }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
      <div className="text-center">
        <Image
          src={user.image}
          alt="Profile Picture"
          width={96}
          height={96}
          className="rounded-full mx-auto"
        />
        <h1 className="text-2xl font-semibold mt-4">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
}
