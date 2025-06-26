import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layanan from "./pages/Layanan";
import DetailLayanan from "./pages/DetailLayanan";
import NotFoundPage from "./pages/NotFoundPage";
import SessionExpired from "./pages/SessionExpired"; // Tambahkan ini

import ProtectedRoute from "./components/ProtectedRoute";
import RouteWithQueueCheck from "./components/RouteWithQueueCheck";
import RequireHandlingQueue from "./components/RequireHandlingQueue";
import CheckCallingStatus from "./components/CheckCallingStatus";
import RequireIsCalling from "./components/RequireIsCalling";
import NetworkStatusHandler from "./components/NetworkStatusHandler";

function App() {
  return (
    <Router>
      <NetworkStatusHandler>
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<Login />} />

          {/* Session Expired Page */}
          <Route path="/session-expired" element={<SessionExpired />} />

          {/* Dashboard Page */}
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

          {/* Layanan Page */}
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

          {/* Detail Layanan Page */}
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

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NetworkStatusHandler>
    </Router>
  );
}

export default App;
