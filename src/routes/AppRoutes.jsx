import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Organization from "../pages/Organization";
import Teams from "../pages/Teams";
import Members from "../pages/Members";
import Profile from "../pages/Profile";

function AppRoutes() {

  const { user } = useContext(AuthContext);

  return (
    <Routes>

      {/* AUTH ROUTES */}

      <Route element={<AuthLayout />}>

        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Signup />}
        />

      </Route>


      {/* DASHBOARD ROUTES */}

      <Route
        element={user ? <DashboardLayout /> : <Navigate to="/" />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/organizations" element={<Organization />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/members" element={<Members />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;