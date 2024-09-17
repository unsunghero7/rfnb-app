"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  requiredRole?: "superadmin" | "admin";
}

const AdminLayout = ({ children, requiredRole }: AdminLayoutProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  if (requiredRole && session.user.role !== requiredRole) {
    router.push("/admin");
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
