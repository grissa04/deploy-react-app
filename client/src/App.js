import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from "react-router-dom";
import RoomList from "./components/RoomList";
import ReservationForm from "./components/ReservationForm";
import ReservationsPage from "./pages/ReservationsPage";
import CalendarPage from "./pages/CalendarPage";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {token && (
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="font-semibold text-lg">StationF Meetings</div>
            <nav className="flex gap-2">
              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Rooms
              </NavLink>
              <NavLink
                to="/my-reservations"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Reservations
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Calendar
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-slate-700 hover:bg-slate-800"
              >
                Logout
              </button>
            </nav>
          </div>
        </header>
      )}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Login route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/rooms" element={<RoomList />} />
          <Route
            path="/reserve/:roomId"
            element={<ProtectedRoute>
              <ReservationForm />
            </ProtectedRoute>} />
          <Route
            path="/my-reservations"
            element={<ProtectedRoute>
              <ReservationsPage />
            </ProtectedRoute>} />
          <Route
            path="/calendar"
            element={<ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>} />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/rooms" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
