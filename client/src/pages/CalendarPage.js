import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getApiUrl } from "../lib/api";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(getApiUrl("/api/reservations"));
        const reservations = await res.json();

        const formatted = reservations.map((r) => ({
          id: r._id,
          title: `${r.roomId.name} (${r.startTime} - ${r.endTime})`,
          start: new Date(`${r.date}T${r.startTime}`),
          end: new Date(`${r.date}T${r.endTime}`),
          room: r.roomId, // full room object
          reservedBy: r.userId?.name || null,
        }));

        setEvents(formatted);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <h2 className="text-2xl font-bold mb-4">Reservations Calendar</h2>
      <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
 style={{ height: "70vh", maxHeight: "700px", padding: "20px" }}
  views={["month", "week", "day"]}
  defaultView="month"
  toolbar={true}
  date={currentDate}                 // 👈 control the date
  onNavigate={(date) => setCurrentDate(date)} // 👈 update on navigation
  onSelectEvent={(event) => setSelectedEvent(event)}
/>


      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-xl font-bold mb-2">{selectedEvent.room.name}</h3>
            <p><strong>Date:</strong> {moment(selectedEvent.start).format("YYYY-MM-DD")}</p>
            <p><strong>Time:</strong> {moment(selectedEvent.start).format("HH:mm")} - {moment(selectedEvent.end).format("HH:mm")}</p>
            <p><strong>Capacity:</strong> {selectedEvent.room.capacity}</p>
            <p><strong>Description:</strong> {selectedEvent.room.description}</p>
            <p><strong>Reserved by:</strong> {selectedEvent.reservedBy || "Unknown"}</p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
