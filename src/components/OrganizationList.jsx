import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  createOrganization,
  deleteOrganizationById,
  listOrganizations,
} from "../api/api";
import CreatePanel from "./CreatePanel";
import DeleteIconButton from "./DeleteIconButton";
import ModalCloseButton from "./ModalCloseButton";
import ModalShell from "./ModalShell";

function OrganizationList() {
  const { user } = useContext(AuthContext);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingOrganizationId, setDeletingOrganizationId] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const sortedOrganizations = useMemo(() => {
    const toTimestamp = (value) => {
      if (typeof value === "number") {
        return value < 1_000_000_000_000 ? value * 1000 : value;
      }

      const parsed = Date.parse(value || "");
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    return [...organizations].sort(
      (a, b) => toTimestamp(b.created_at) - toTimestamp(a.created_at)
    );
  }, [organizations]);

  const selectedOrganization = useMemo(() => {
    if (!sortedOrganizations.length) {
      return null;
    }

    return (
      sortedOrganizations.find((organization) => organization.id === selectedOrganizationId) ||
      sortedOrganizations[0]
    );
  }, [selectedOrganizationId, sortedOrganizations]);

  useEffect(() => {
    let mounted = true;

    const loadOrganizations = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await listOrganizations(user?.accessToken);
        if (mounted) {
          setOrganizations(data.organizations || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load organizations");
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
    if (!sortedOrganizations.length) {
      setSelectedOrganizationId("");
      return;
    }

    setSelectedOrganizationId((currentId) => {
      if (sortedOrganizations.some((organization) => organization.id === currentId)) {
        return currentId;
      }

      return sortedOrganizations[0].id;
    });
  }, [sortedOrganizations]);

  const handleCreateOrganization = async (event) => {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) {
      setSubmitError("Organization name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const createdOrganization = await createOrganization(
        {
          name: normalizedName,
          description: description.trim() || null,
        },
        user?.accessToken
      );

      setOrganizations((prev) => [createdOrganization, ...prev]);
      setSelectedOrganizationId(createdOrganization.id);
      setName("");
      setDescription("");
      setIsCreateOpen(false);
    } catch (err) {
      setSubmitError(err.message || "Unable to create organization");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrganization = async (organization) => {
    if (!organization?.id || deletingOrganizationId) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete organization "${organization.name}"? This action cannot be undone.`
    );
    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingOrganizationId(organization.id);
      setError("");
      await deleteOrganizationById(organization.id, user?.accessToken);
      setOrganizations((prev) => prev.filter((item) => item.id !== organization.id));
    } catch (err) {
      setError(err.message || "Unable to delete organization");
    } finally {
      setDeletingOrganizationId("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-[200px] max-w-xs">
          <label
            htmlFor="organization-selector"
            className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Your organizations
          </label>
          <select
            id="organization-selector"
            value={selectedOrganization?.id || ""}
            onChange={(event) => setSelectedOrganizationId(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
            disabled={sortedOrganizations.length === 0}
          >
            {sortedOrganizations.length === 0 ? (
              <option value="">No organizations available</option>
            ) : (
              sortedOrganizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))
            )}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitError("");
            setIsCreateOpen(true);
          }}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
        >
          Create organization
        </button>
      </div>

      {loading && <p className="text-sm text-slate-600">Loading organizations...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {selectedOrganization && (
            <section className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedOrganization.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedOrganization.description || "No description provided yet."}
                  </p>
                </div>
                <DeleteIconButton
                  onClick={() => handleDeleteOrganization(selectedOrganization)}
                  disabled={Boolean(deletingOrganizationId)}
                  label={`Delete ${selectedOrganization.name}`}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="rounded-md bg-white px-2 py-1">
                  Teams: {selectedOrganization.teams_count}
                </span>
                <span className="rounded-md bg-white px-2 py-1">
                  Members: {selectedOrganization.members_count}
                </span>
                <span className="rounded-md bg-white px-2 py-1">
                  Created at: {new Date(selectedOrganization.created_at * 1000).toLocaleString()}
                </span>
              </div>
            </section>
          )}
        </>
      )}

      {isCreateOpen && (
        <ModalShell onClose={() => setIsCreateOpen(false)} disableClose={submitting}>
          <CreatePanel
            title={organizations.length ? "Add organization" : "Create your first organization"}
            description="Fill in organization details to continue."
            submitError={submitError}
            submitLabel="Create organization"
            submitting={submitting}
            onSubmit={handleCreateOrganization}
          >
            <ModalCloseButton onClose={() => setIsCreateOpen(false)} disabled={submitting} />

            <div>
              <label htmlFor="organization-name" className="block text-sm font-medium text-cyan-100">
                Organization name
              </label>
              <input
                id="organization-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Acme Organization"
                className="mt-1 w-full rounded-lg border border-cyan-600/40 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
                maxLength={256}
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="organization-description" className="block text-sm font-medium text-cyan-100">
                Description (optional)
              </label>
              <textarea
                id="organization-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe your organization"
                className="mt-1 w-full rounded-lg border border-cyan-600/40 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/40"
                rows={3}
                disabled={submitting}
              />
            </div>
          </CreatePanel>
        </ModalShell>
      )}
    </div>
  );
}

export default OrganizationList;