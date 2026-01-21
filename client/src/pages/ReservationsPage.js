import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reservations");
      setReservations(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/reservations/${id}`);
      alert(res.data.message || "Reservation cancelled");
      fetchReservations(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel this reservation");
    }
  };

  if (loading) return <p>Loading your reservations...</p>;

  if (reservations.length === 0) return <p>No reservations yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Reservations</h2>
      <ul className="space-y-4">
        {reservations.map((resv) => (
          <li key={resv._id} className="p-4 border rounded-lg shadow flex justify-between items-center">
            <div>
              <p>
                <strong>Room:</strong> {resv.roomId.name || resv.roomId}
              </p>
              <p>
                <strong>Reserved by:</strong>{" "}
                {resv.userId?.name || "Unknown"}
              </p>
              <p>
                <strong>Date:</strong> {resv.date} | <strong>Time:</strong> {resv.startTime} - {resv.endTime}
              </p>
            </div>
            <button
              onClick={() => handleCancel(resv._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
