import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Restaurant Order App
      </h1>
      <p className="text-xl mb-8">Manage your restaurant orders efficiently</p>
      <Link
        href="/auth/login"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Login
      </Link>
      <Link
        href="/restaurant"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Restaurants
      </Link>
    </div>
  );
}
