function TeamList() {
  const teams = [
    { name: "Product Ops", members: 8, lead: "Alina" },
    { name: "Growth", members: 6, lead: "Rahul" },
    { name: "Platform", members: 10, lead: "Mina" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <article key={team.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{team.name}</h3>
          <p className="mt-2 text-sm text-slate-600">Team Lead: {team.lead}</p>
          <p className="mt-1 text-sm text-slate-600">Members: {team.members}</p>
        </article>
      ))}
    </div>
  );
}

export default TeamList;