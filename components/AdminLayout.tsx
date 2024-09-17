import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface AdminLayoutProps {
  children: ReactNode;
  requiredRole?: "superadmin" | "admin";
}

const AdminLayout = async ({ children, requiredRole }: AdminLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (requiredRole && session.user.role !== requiredRole) {
    redirect("/admin");
  }

  return (
    <div>
      {/* Add admin navigation, header, etc. here */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
