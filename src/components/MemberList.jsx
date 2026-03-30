function MemberList() {
  const members = [
    { name: "Aisha Khan", role: "Product Manager", status: "Active" },
    { name: "Darren Cole", role: "Frontend Engineer", status: "Active" },
    { name: "Priya Sharma", role: "Designer", status: "Away" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <ul className="divide-y divide-slate-200">
        {members.map((member) => (
          <li key={member.name} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium text-slate-900">{member.name}</p>
              <p className="text-sm text-slate-600">{member.role}</p>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {member.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;