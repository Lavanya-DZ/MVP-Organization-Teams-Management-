import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  createTeamByOrganization,
  deleteTeamById,
  listOrganizations,
  listTeamsByOrganization,
} from "../api/api";
import CreatePanel from "./CreatePanel";
import DeleteIconButton from "./DeleteIconButton";
import ModalCloseButton from "./ModalCloseButton";
import ModalShell from "./ModalShell";
import TeamFormFields from "./TeamFormFields";

function TeamList() {
  const { user } = useContext(AuthContext);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingTeamId, setDeletingTeamId] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadOrganizations = async () => {
      try {
        setLoading(true);
        setError("");

        const organizationsData = await listOrganizations(user?.accessToken);
        const orgList = organizationsData.organizations || [];

        if (!orgList.length) {
          if (mounted) {
            setOrganizations([]);
            setSelectedOrganizationId("");
            setTeams([]);
          }
          return;
        }

        if (mounted) {
          setOrganizations(orgList);
          setSelectedOrganizationId((previousOrgId) => {
            if (previousOrgId && orgList.some((org) => org.id === previousOrgId)) {
              return previousOrgId;
            }
            return orgList[0].id;
          });
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load teams");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (user?.accessToken) {
      loadOrganizations();
    }

    return () => {
      mounted = false;
    };
  }, [user?.accessToken]);

  useEffect(() => {
    let mounted = true;

    const loadTeams = async () => {
      if (!selectedOrganizationId || !user?.accessToken) {
        setTeams([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const teamsData = await listTeamsByOrganization(
          selectedOrganizationId,
          user?.accessToken
        );

        if (mounted) {
          setTeams(teamsData?.teams || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load teams");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTeams();

    return () => {
      mounted = false;
    };
  }, [selectedOrganizationId, user?.accessToken]);

  useEffect(() => {
    if (!teams.length) {
      setSelectedTeamId("");
      return;
    }

    setSelectedTeamId((currentId) => {
      if (teams.some((team) => team.id === currentId)) {
        return currentId;
      }

      return teams[0].id;
    });
  }, [teams]);

  const selectedTeam =
    teams.find((team) => team.id === selectedTeamId) || teams[0] || null;

  const handleCreateTeam = async (event) => {
    event.preventDefault();

    const normalizedName = teamName.trim();
    if (!normalizedName) {
      setSubmitError("Team name is required.");
      return;
    }

    if (!selectedOrganizationId) {
      setSubmitError("Please select an organization first.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const createdTeam = await createTeamByOrganization(
        selectedOrganizationId,
        {
          name: normalizedName,
          description: teamDescription.trim() || null,
        },
        user?.accessToken
      );

      const selectedOrganization = organizations.find(
        (organization) => organization.id === selectedOrganizationId
      );

      setTeams((prev) => [
        {
          ...createdTeam,
          organizationName: selectedOrganization?.name || "",
        },
        ...prev,
      ]);
      setSelectedTeamId(createdTeam.id);
      setTeamName("");
      setTeamDescription("");
      setIsCreateOpen(false);
    } catch (err) {
      setSubmitError(err.message || "Unable to create team");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async (team) => {
    if (!team?.id || deletingTeamId) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete team "${team.name}"? This action cannot be undone.`
    );
    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingTeamId(team.id);
      setError("");
      await deleteTeamById(team.id, team.organization_id, user?.accessToken);
      setTeams((prev) => prev.filter((item) => item.id !== team.id));
      setOrganizations((prev) =>
        prev.map((organization) => {
          if (organization.id !== team.organization_id) {
            return organization;
          }

          return {
            ...organization,
            teams_count: Math.max(0, (organization.teams_count || 0) - 1),
          };
        })
      );
    } catch (err) {
      setError(err.message || "Unable to delete team");
    } finally {
      setDeletingTeamId("");
    }
  };

  return (
    <div className="space-y-5">
      {loading && <p className="text-sm text-slate-600">Loading teams...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && organizations.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          You do not have any organization yet. Create one from the Organizations tab first.
        </div>
      )}

      {!loading && !error && organizations.length > 0 && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <div className="min-w-[200px] max-w-xs">
                <label htmlFor="team-organization-filter" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Organization
                </label>
                <select
                  id="team-organization-filter"
                  value={selectedOrganizationId}
                  onChange={(event) => setSelectedOrganizationId(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                >
                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                      {organization.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-[200px] max-w-xs">
                <label htmlFor="team-selector" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Teams
                </label>
                <select
                  id="team-selector"
                  value={selectedTeam?.id || ""}
                  onChange={(event) => setSelectedTeamId(event.target.value)}
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
              onClick={() => {
                setSubmitError("");
                setIsCreateOpen(true);
              }}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
            >
              Create team
            </button>
          </div>

          {teams.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No teams found. Click Create team to add one.
            </div>
          )}

          {selectedTeam && (
            <section className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedTeam.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedTeam.description || "No description provided yet."}
                  </p>
                </div>
                <DeleteIconButton
                  onClick={() => handleDeleteTeam(selectedTeam)}
                  disabled={Boolean(deletingTeamId)}
                  label={`Delete ${selectedTeam.name}`}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="rounded-md bg-white px-2 py-1">Team ID: {selectedTeam.id}</span>
                <span className="rounded-md bg-white px-2 py-1">
                  Organization: {selectedTeam.organizationName || organizations.find((org) => org.id === selectedTeam.organization_id)?.name || selectedTeam.organization_id}
                </span>
              </div>
            </section>
          )}
        </>
      )}

      {isCreateOpen && organizations.length > 0 && (
        <ModalShell onClose={() => setIsCreateOpen(false)} disableClose={submitting}>
          <CreatePanel
            title="Create team"
            description="Fill in team details for the selected organization."
            submitError={submitError}
            submitLabel="Create team"
            submitting={submitting}
            onSubmit={handleCreateTeam}
          >
            <ModalCloseButton onClose={() => setIsCreateOpen(false)} disabled={submitting} />

            <TeamFormFields
              organizations={organizations}
              selectedOrganizationId={selectedOrganizationId}
              onOrganizationChange={(event) => setSelectedOrganizationId(event.target.value)}
              teamName={teamName}
              onTeamNameChange={(event) => setTeamName(event.target.value)}
              teamDescription={teamDescription}
              onTeamDescriptionChange={(event) => setTeamDescription(event.target.value)}
              submitting={submitting}
            />
          </CreatePanel>
        </ModalShell>
      )}
    </div>
  );
}

export default TeamList;