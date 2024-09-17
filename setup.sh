#!/bin/bash

# Create directories
mkdir -p app/admin/manage app/auth/login app/api/auth/[...nextauth] components lib prisma

# Create files
touch app/page.tsx
touch app/admin/page.tsx
touch app/admin/manage/page.tsx
touch app/auth/login/page.tsx
touch app/api/auth/[...nextauth]/route.ts
touch components/LoginForm.tsx
touch components/AdminLayout.tsx
touch lib/prisma.ts
touch prisma/schema.prisma
touch prisma/seed.ts

# Add content to files
cat << EOF > app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to the Restaurant Order App</h1>
      {/* Add content for the home page */}
    </main>
  )
}
EOF

cat << EOF > app/admin/page.tsx
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>
      {/* Add admin dashboard content */}
    </AdminLayout>
  );
}
EOF

cat << EOF > app/admin/manage/page.tsx
import AdminLayout from '@/components/AdminLayout';

export default function ManageRestaurants() {
  return (
    <AdminLayout requiredRole="superadmin">
      <h1>Manage Restaurants</h1>
      {/* Add restaurant management content */}
    </AdminLayout>
  );
}
EOF

cat << EOF > app/auth/login/page.tsx
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
EOF

cat << EOF > app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user) {
          return null;
        }
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
EOF

cat << EOF > components/LoginForm.tsx
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      // Handle error (e.g., show error message)
    } else {
      router.push('/admin');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign in
      </button>
    </form>
  );
};

export default LoginForm;
EOF

cat << EOF > components/AdminLayout.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  requiredRole?: 'superadmin' | 'admin';
}

const AdminLayout = ({ children, requiredRole }: AdminLayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (requiredRole && session.user.role !== requiredRole) {
    router.push('/admin');
    return null;
  }

  return (
    <div>
      {/* Add admin navigation, header, etc. here */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
EOF

cat << EOF > lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
EOF

cat << EOF > prisma/schema.prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      String   @default("customer")
  // Add other fields as needed
}
EOF

cat << EOF > prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('password123', 12)

  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@gmail.com' },
    update: {},
    create: {
      email: 'superadmin@gmail.com',
      password,
      role: 'superadmin',
    },
  })

  const restaurantAdmin = await prisma.user.upsert({
    where: { email: 'restaurantadmin@gmail.com' },
    update: {},
    create: {
      email: 'restaurantadmin@gmail.com',
      password,
      role: 'admin',
    },
  })

  const customer = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {},
    create: {
      email: 'customer@gmail.com',
      password,
      role: 'customer',
    },
  })

  console.log({ superadmin, restaurantAdmin, customer })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
EOF

echo "Project structure and files have been created successfully!"