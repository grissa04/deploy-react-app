import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div
          key={room._id}
          className="border rounded-xl shadow-lg p-4 bg-white flex flex-col"
        >
          <h3 className="text-xl font-bold mb-2">{room.name}</h3>
          <p className="text-gray-600 mb-2">{room.description}</p>
          <p className="mb-2">
            <strong>Capacity:</strong> {room.capacity}
          </p>
          <p className="mb-4">
            <strong>Equipments:</strong>{" "}
            {room.equipements.length > 0
              ? room.equipements.map((e) => e.name).join(", ")
              : "None"}
          </p>
          <button
            className="mt-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              const token = localStorage.getItem("token");
              if (!token) {
                navigate("/login", {
                  state: { from: `/reserve/${room._id}`, reason: "member_required" },
                });
                return;
              }
              navigate(`/reserve/${room._id}`);
            }}
          >
            Reserve
          </button>
        </div>
      ))}
    </div>
  );
}
