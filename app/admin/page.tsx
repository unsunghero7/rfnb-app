import AdminLayout from "@/components/AdminLayout";

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your admin dashboard. Here you can manage your restaurant
          orders and settings.
        </p>
        {/* Add more admin dashboard content here */}
      </div>
    </AdminLayout>
  );
}
