import AdminLayout from "@/components/AdminLayout";

export default function ManageRestaurants() {
  return (
    <AdminLayout requiredRole="superadmin">
      <h1>Manage Restaurants</h1>
      {/* Add restaurant management content */}
    </AdminLayout>
  );
}
