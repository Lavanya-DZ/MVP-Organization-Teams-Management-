import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Organizations", path: "/organizations" },
  { name: "Teams", path: "/teams" },
  { name: "Members", path: "/members" },
  { name: "Profile", path: "/profile" },
];

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col bg-slate-900 px-3 py-6 text-slate-100 sm:w-72 sm:px-5">
      <div className="mb-8 rounded-xl border border-slate-700/70 bg-slate-800/60 p-3 sm:p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Workspace</p>
        <h1 className="mt-2 hidden text-xl font-semibold sm:block">MVP Teams</h1>
      </div>

      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                [
                  "block rounded-lg px-4 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-cyan-400 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                ].join(" ")
              }
            >
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sm:hidden">{item.name.charAt(0)}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-3 border-t border-slate-700/70 pt-4">
        <p className="hidden truncate text-xs text-slate-400 sm:block">{user?.email || "Guest"}</p>
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-cyan-300 sm:px-4 sm:text-sm"
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;