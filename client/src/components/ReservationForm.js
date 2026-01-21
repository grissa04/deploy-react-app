import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiUrl } from "../lib/api";

export default function ReservationForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(roomId || "");
  const [roomDetails, setRoomDetails] = useState(null);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetch(getApiUrl("/api/rooms"))
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms || []);
        if (roomId) {
          const foundRoom = data.rooms.find((r) => r._id === roomId);
          setRoomDetails(foundRoom || null);
        }
      });
  }, [roomId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const today = new Date();
  const selectedDate = new Date(`${form.date}T${form.startTime}`);

  // ✅ Prevent reserving past dates/times
  if (selectedDate < today) {
    alert("❌ You cannot reserve a room in the past.");
    return;
  }

  const reservation = {
    roomId: selectedRoom,
    date: form.date,
    startTime: form.startTime,
    endTime: form.endTime,
  };

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to be a member to reserve a room.");
    navigate("/login", {
      state: { from: `/reserve/${selectedRoom}`, reason: "member_required" },
    });
    return;
  }

  const res = await fetch(getApiUrl("/api/reservations"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(reservation),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(`❌ ${data.message || "Error making reservation"}`);
    return;
  }

  alert(
    `✅ Reservation created! You cannot cancel or update it less than 24h before its start.`
  );
};


  

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Make a Reservation</h2>

      {roomDetails ? (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold">{roomDetails.name}</h3>
          <p className="text-gray-600">{roomDetails.description}</p>
          <p>
            <strong>Capacity:</strong> {roomDetails.capacity}
          </p>
          <p>
            <strong>Equipments:</strong>{" "}
            {roomDetails.equipements.length > 0
              ? roomDetails.equipements.map((e) => e.name).join(", ")
              : "None"}
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block font-medium">Room</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Time inputs */}
        <div>
          <label className="block font-medium">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">End Time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
        >
          Reserve
        </button>
      </form>
    </div>
  );
}
