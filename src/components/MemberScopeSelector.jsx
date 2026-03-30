function MemberScopeSelector({
  organizations,
  teams,
  selectedOrganizationId,
  selectedTeamId,
  onOrganizationChange,
  onTeamChange,
  onAddMember,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="member-organization" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Organization
          </label>
          <select
            id="member-organization"
            value={selectedOrganizationId}
            onChange={onOrganizationChange}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
          >
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="member-team" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Team
          </label>
          <select
            id="member-team"
            value={selectedTeamId}
            onChange={onTeamChange}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
            disabled={teams.length === 0}
          >
            {teams.length === 0 ? (
              <option value="">No teams available</option>
            ) : (
              teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddMember}
        disabled={!selectedTeamId}
        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Add member
      </button>
    </div>
  );
}

export default MemberScopeSelector;
