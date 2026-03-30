function Dashboard(){
  const cards = [
    { title: "Active Projects", value: "12", trend: "+18% this month" },
    { title: "Teams Online", value: "7", trend: "2 currently in review" },
    { title: "Open Tasks", value: "46", trend: "9 due this week" },
  ];

  return(
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <p className="mt-2 text-slate-200">Welcome to your command center.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-1 text-sm text-emerald-600">{card.trend}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default Dashboard;