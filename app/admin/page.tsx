"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminLayout from "@/components/AdminLayout";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  owner: {
    email: string;
  };
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("/api/restaurants");
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      } else {
        console.error("Failed to fetch restaurants");
      }
    };
    fetchRestaurants();
  }, []);

  const handleEdit = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setEditName(restaurant.name);
    setEditSlug(restaurant.slug);
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/restaurants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, slug: editSlug }),
    });

    if (res.ok) {
      const updatedRestaurant = await res.json();
      setRestaurants(
        restaurants.map((r) =>
          r.id === id ? { ...r, ...updatedRestaurant } : r
        )
      );
      setEditingId(null);
    } else {
      console.error("Failed to update restaurant");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Restaurants</h2>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="mb-4 p-4 border rounded">
          {editingId === restaurant.id ? (
            <>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mb-2 p-2 border rounded"
                placeholder="Restaurant Name"
              />
              <input
                type="text"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="mb-2 p-2 border rounded"
                placeholder="Restaurant Slug"
              />
              <button
                onClick={() => handleSave(restaurant.id)}
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">{restaurant.name}</h3>
              <p className="text-gray-600">Slug: {restaurant.slug}</p>
              <p className="text-gray-600">Owner: {restaurant.owner.email}</p>
              {(session?.user.role === "superadmin" ||
                session?.user.email === restaurant.owner.email) && (
                <button
                  onClick={() => handleEdit(restaurant)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </AdminLayout>
  );
}
