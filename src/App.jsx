import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layanan from "./pages/Layanan";
import DetailLayanan from "./pages/DetailLayanan";
import NotFoundPage from "./pages/NotFoundPage";

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
          {/* Login Page (Public) */}
          <Route path="/" element={<Login />} />

          {/* Dashboard Page (Protected + Check Calling Status + Queue Check) */}
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

          {/* Layanan Page (Protected + IsCalling + Queue Check) */}
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

          {/* Detail Layanan Page (Protected + CheckCallingStatus + Handling Queue) */}
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

          {/* Catch All - 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NetworkStatusHandler>
    </Router>
  );
}

export default App;
