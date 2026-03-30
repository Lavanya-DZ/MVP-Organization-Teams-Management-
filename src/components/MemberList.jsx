import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  createMemberByTeam,
  listOrganizations,
  listTeamsByOrganization,
  listMembersByTeam,
} from "../api/api";
import CreatePanel from "./CreatePanel";
import MemberFormFields from "./MemberFormFields";
import ModalCloseButton from "./ModalCloseButton";
import ModalShell from "./ModalShell";

function MemberList() {
  const { user } = useContext(AuthContext);
  const [organizations, setOrganizations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [members, setMembers] = useState([]);
  const [authUserId, setAuthUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadOrganizations = async () => {
      try {
        setLoading(true);
        setError("");

        const organizationsData = await listOrganizations(user?.accessToken);
        const orgList = organizationsData.organizations || [];

        if (mounted) {
          setOrganizations(orgList);
          setSelectedOrganizationId((previousOrgId) => {
            if (previousOrgId && orgList.some((organization) => organization.id === previousOrgId)) {
              return previousOrgId;
            }
            return orgList[0]?.id || "";
          });
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load members");
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
        setSelectedTeamId("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const teamsData = await listTeamsByOrganization(
          selectedOrganizationId,
          user?.accessToken
        );
        const teamList = teamsData.teams || [];

        if (mounted) {
          setTeams(teamList);
          setSelectedTeamId((previousTeamId) => {
            if (previousTeamId && teamList.some((team) => team.id === previousTeamId)) {
              return previousTeamId;
            }
            return teamList[0]?.id || "";
          });
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load teams");
          setTeams([]);
          setSelectedTeamId("");
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
    let mounted = true;

    const loadMembers = async () => {
      if (!selectedTeamId || !user?.accessToken) {
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const membersData = await listMembersByTeam(selectedTeamId, user?.accessToken);

        if (mounted) {
          setMembers(membersData.members || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load members");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMembers();

    return () => {
      mounted = false;
    };
  }, [selectedTeamId, user?.accessToken]);

  const selectedMember = members[0] || null;

  const handleCreateMember = async (event) => {
    event.preventDefault();

    const normalizedAuthUserId = authUserId.trim();
    if (!normalizedAuthUserId) {
      setSubmitError("Auth User ID is required.");
      return;
    }

    if (!selectedTeamId) {
      setSubmitError("Please select a team first.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const createdMember = await createMemberByTeam(
        selectedTeamId,
        { auth_user_id: normalizedAuthUserId },
        user?.accessToken
      );

      setMembers((previousMembers) => [createdMember, ...previousMembers]);
      setAuthUserId("");
      setIsCreateOpen(false);
    } catch (err) {
      setSubmitError(err.message || "Unable to create member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {!loading && !error && organizations.length > 0 && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[200px] max-w-xs">
              <label htmlFor="member-organization" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Organization
              </label>
              <select
                id="member-organization"
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
              <label htmlFor="member-team" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Team
              </label>
              <select
                id="member-team"
                value={selectedTeamId}
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
            disabled={!selectedTeamId}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add member
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-slate-600">Loading members...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && organizations.length === 0 && (
        <p className="text-sm text-slate-600">No organizations found. Create one first.</p>
      )}

      {!loading && !error && organizations.length > 0 && teams.length === 0 && (
        <p className="text-sm text-slate-600">No teams found for the selected organization.</p>
      )}

      {!loading && !error && teams.length > 0 && members.length === 0 && (
        <p className="text-sm text-slate-600">No members found.</p>
      )}

      {!loading && !error && selectedTeamId && selectedMember && (
        <section className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Auth User ID: {selectedMember.auth_user_id}
              </h3>
              <p className="mt-1 text-sm text-slate-600">Member details for selected team.</p>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Active
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="rounded-md bg-white px-2 py-1">Member ID: {selectedMember.id}</span>
            <span className="rounded-md bg-white px-2 py-1">Team ID: {selectedTeamId}</span>
          </div>
        </section>
      )}

      {isCreateOpen && (
        <ModalShell onClose={() => setIsCreateOpen(false)} disableClose={submitting}>
          <CreatePanel
            title="Add member"
            description="Attach an auth user to the selected team."
            submitError={submitError}
            submitLabel="Add member"
            submitting={submitting}
            onSubmit={handleCreateMember}
          >
            <ModalCloseButton onClose={() => setIsCreateOpen(false)} disabled={submitting} />

            <MemberFormFields
              authUserId={authUserId}
              onAuthUserIdChange={(event) => setAuthUserId(event.target.value)}
              submitting={submitting}
            />
          </CreatePanel>
        </ModalShell>
      )}
    </div>
  );
}

export default MemberList;