// components/SignOutButton.js

export default function SignOutButton({ onSignOut }) {
    return (
      <button
        onClick={onSignOut}
        className="mt-6 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Sign out
      </button>
    );
  }
  