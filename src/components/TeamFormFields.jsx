function TeamFormFields({
  organizations,
  selectedOrganizationId,
  onOrganizationChange,
  teamName,
  onTeamNameChange,
  teamDescription,
  onTeamDescriptionChange,
  submitting,
}) {
  return (
    <>
      <div>
        <label htmlFor="team-organization" className="block text-sm font-medium text-cyan-100">
          Organization
        </label>
        <select
          id="team-organization"
          value={selectedOrganizationId}
          onChange={onOrganizationChange}
          className="mt-1 w-full rounded-lg border border-cyan-600/40 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
          disabled={submitting}
        >
          {organizations.map((organization) => (
            <option key={organization.id} value={organization.id} className="text-slate-900">
              {organization.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="team-name" className="block text-sm font-medium text-cyan-100">
          Team name
        </label>
        <input
          id="team-name"
          type="text"
          value={teamName}
          onChange={onTeamNameChange}
          placeholder="Platform Team"
          maxLength={256}
          className="mt-1 w-full rounded-lg border border-cyan-600/40 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
          disabled={submitting}
        />
      </div>

      <div>
        <label htmlFor="team-description" className="block text-sm font-medium text-cyan-100">
          Description (optional)
        </label>
        <textarea
          id="team-description"
          value={teamDescription}
          onChange={onTeamDescriptionChange}
          placeholder="Describe this team"
          rows={3}
          className="mt-1 w-full rounded-lg border border-cyan-600/40 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
          disabled={submitting}
        />
      </div>
    </>
  );
}

export default TeamFormFields;