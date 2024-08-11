'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        router.push('/signin');
        return null; // Ensure nothing is rendered during redirection
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl">Welcome, {session.user.name}</h1>
            <p>Email: {session.user.email}</p>
            <button
                onClick={() => signOut()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Sign out
            </button>
        </div>
    );
}
