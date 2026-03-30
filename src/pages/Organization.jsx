function Organization(){
  const organizations = [
    { name: "Nova Labs", teams: 4, region: "North America" },
    { name: "Helix Works", teams: 3, region: "Europe" },
    { name: "Aster Group", teams: 5, region: "Asia" },
  ];

  return(
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Organizations</h2>
        <p className="mt-1 text-sm text-slate-600">Manage your connected organizations and team distribution.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {organizations.map((org) => (
          <article key={org.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{org.name}</h3>
            <p className="mt-2 text-sm text-slate-600">Teams: {org.teams}</p>
            <p className="text-sm text-slate-600">Region: {org.region}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Organization;