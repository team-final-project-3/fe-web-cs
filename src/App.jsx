import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layanan from "./pages/Layanan";
import DetailLayanan from "./pages/DetailLayanan";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteWithQueueCheck from "./components/RouteWithQueueCheck";
import RequireHandlingQueue from "./components/RequireHandlingQueue";
import CheckCallingStatus from "./components/CheckCallingStatus"; // ✅ middleware baru
import RequireIsCalling from "./components/RequireIsCalling";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Login - tidak diproteksi */}
        <Route path="/" element={<Login />} />

        {/* Route CS Dashboard dengan is-calling check */}
        <Route
          path="/cs-dashboard"
          element={
            <ProtectedRoute>
              <CheckCallingStatus>
                <RouteWithQueueCheck>
                  <Dashboard />
                </RouteWithQueueCheck>
              </CheckCallingStatus>
            </ProtectedRoute>
          }
        />

        {/* Route CS Layanan - tanpa is-calling check */}
        <Route
          path="/cs-layanan"
          element={
            <ProtectedRoute>
              <RequireIsCalling>
                <RouteWithQueueCheck>
                  <Layanan />
                </RouteWithQueueCheck>
              </RequireIsCalling>
            </ProtectedRoute>
          }
        />

        {/* Route CS Detail Layanan dengan is-calling check */}
        <Route
          path="/cs-detail-layanan"
          element={
            <ProtectedRoute>
              <CheckCallingStatus>
                <RequireHandlingQueue>
                  <DetailLayanan />
                </RequireHandlingQueue>
              </CheckCallingStatus>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
