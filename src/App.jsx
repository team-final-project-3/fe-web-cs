import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layanan from "./pages/Layanan";
import DetailLayanan from "./pages/DetailLayanan";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login terbuka */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/cs-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cs-layanan"
          element={
            <ProtectedRoute>
              <Layanan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cs-detail-layanan"
          element={
            <ProtectedRoute>
              <DetailLayanan />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
