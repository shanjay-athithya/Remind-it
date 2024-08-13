'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

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

  const addTask = async (task) => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Profile Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm mx-auto mb-8">
        <div className="text-center">
          <img
            src={session.user.image}
            alt="Profile Picture"
            className="rounded-full w-24 h-24 mx-auto"
          />
          <h1 className="text-2xl font-semibold mt-4">{session.user.name}</h1>
          <p className="text-gray-600">{session.user.email}</p>
          <button
            onClick={() => signOut()}
            className="mt-6 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Task Form and List */}
      <div className="max-w-3xl mx-auto">
        <TaskForm onSubmit={addTask} />
        <TaskList />
      </div>
    </div>
  );
}
