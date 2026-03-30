import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
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
import { listOrganizations } from "../api/api";
import { ROUTES } from "../utils/constants";

function OrganizationRequiredRoute() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [hasOrganization, setHasOrganization] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkOrganization = async () => {
      if (!user?.accessToken) {
        if (mounted) {
          setHasOrganization(false);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await listOrganizations(user.accessToken);
        if (mounted) {
          setHasOrganization((data.organizations || []).length > 0);
        }
      } catch (error) {
        if (mounted) {
          setHasOrganization(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkOrganization();

    return () => {
      mounted = false;
    };
  }, [user?.accessToken]);

  if (loading) {
    return <p className="text-sm text-slate-600">Checking organization access...</p>;
  }

  return hasOrganization ? <Outlet /> : <Navigate to="/organizations" replace />;
}

function AppRoutes() {

  const { user } = useContext(AuthContext);

  return (
    <Routes>

      {/* AUTH ROUTES */}

      <Route element={<AuthLayout />}>

        <Route
          path={ROUTES.LOGIN}
          element={user ? <Navigate to={ROUTES.DASHBOARD} /> : <Login />}
        />

        <Route
          path={ROUTES.SIGNUP}
          element={user ? <Navigate to={ROUTES.DASHBOARD} /> : <Signup />}
        />

      </Route>


      {/* DASHBOARD ROUTES */}

      <Route
        element={user ? <DashboardLayout /> : <Navigate to={ROUTES.LOGIN} />}
      >
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.ORGANIZATIONS} element={<Organization />} />
        <Route element={<OrganizationRequiredRoute />}>
          <Route path={ROUTES.TEAMS} element={<Teams />} />
          <Route path={ROUTES.MEMBERS} element={<Members />} />
        </Route>
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;