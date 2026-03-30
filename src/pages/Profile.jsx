import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";

function Profile(){
  const { user } = useContext(AuthContext);

  return(
    <div className="space-y-5">
      <PageHeader
        title="Profile"
        description="Manage your account and workspace preferences."
      />

      <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Account Details</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{user?.email || "Not available"}</dd>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium text-slate-900">Administrator</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium text-emerald-600">Active</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default Profile;