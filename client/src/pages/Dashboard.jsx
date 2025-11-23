import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosconfig";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/teams")
      .then((res) => setTeams(res.data))
      .catch(() => setTeams([]));
  }, []);

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await api.delete(`/teams/${teamId}`);
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete team");
    }
  };

  return (
    <div className="fade-in-up">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h6 className="text-uppercase text-muted fw-bold small ls-wider mb-1">
            Workspace
          </h6>
          <h2 className="fw-bolder mb-0">Your Teams</h2>
        </div>
        <button
          className="btn btn-primary-brand shadow-sm"
          data-bs-toggle="modal"
          data-bs-target="#createTeamModal"
        >
          <i className="bi bi-plus-lg me-2"></i>New Team
        </button>
      </div>

      <div className="row g-4">
        {/* Empty State */}
        {teams.length === 0 && (
          <div className="col-12">
            <div className="text-center py-5 border-2 border-dashed rounded-4 bg-light">
              <div className="text-muted mb-3 display-4">📂</div>
              <h5 className="fw-bold text-muted">No teams found</h5>
              <p className="text-muted small mb-4">
                Get started by creating your first team workspace.
              </p>
              <button
                className="btn btn-outline-brand"
                data-bs-toggle="modal"
                data-bs-target="#createTeamModal"
              >
                Create Team
              </button>
            </div>
          </div>
        )}

        {/* Team Cards */}
        {teams.map((t) => (
          <div className="col-md-6 col-lg-4" key={t._id}>
            <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift-sm transition-all position-relative">
              <div className="card-body p-4 d-flex flex-column">
                {/* Card Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    {/* Team Icon Placeholder */}
                    <div
                      className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                      style={{
                        width: "48px",
                        height: "48px",
                        fontSize: "1.25rem",
                      }}
                    >
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="card-title fw-bold mb-0 text-dark">
                        {t.name}
                      </h5>
                      <small className="text-muted">
                        {t.members?.length || 0} member
                        {t.members?.length !== 1 && "s"}
                      </small>
                    </div>
                  </div>

                  {/* Delete Button (Admin Only) */}
                  {user &&
                    t.members &&
                    t.members.some(
                      (m) =>
                        (m.user === user.id || m.user?._id === user.id) &&
                        m.role === "admin"
                    ) && (
                      <button
                        type="button"
                        className="btn btn-link text-muted p-0 position-relative"
                        style={{ opacity: 0.6, zIndex: 10 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteTeam(t._id);
                        }}
                        title="Delete team"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                </div>

                {/* Description */}
                <p className="card-text text-muted small flex-grow-1 mb-4">
                  {t.description || "No description provided."}
                </p>

                {/* Footer Action */}
                <Link
                  to={`/teams/${t._id}`}
                  className="btn btn-outline-brand w-100 fw-bold stretched-link"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      <div
        className="modal fade"
        id="createTeamModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Create new team</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const name = form.name.value;
                const description = form.description.value;
                try {
                  await api.post("/teams", { name, description });
                  const res = await api.get("/teams");
                  setTeams(res.data);
                  form.reset(); // Optional: Clear form
                } catch (err) {
                  alert(
                    err.response?.data?.message || "Failed to create team"
                  );
                }
              }}
            >
              <div className="modal-body pt-3">
                <p className="text-muted small mb-4">
                  Give your team a name and description to get started.
                </p>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    Team Name
                  </label>
                  <input
                    name="name"
                    className="form-control bg-light border-0"
                    placeholder="e.g. Engineering, Marketing..."
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="form-control bg-light border-0"
                    rows="3"
                    placeholder="What is this team working on?"
                  />
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button
                  className="btn btn-light text-muted fw-bold"
                  type="button"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary-brand fw-bold px-4"
                  type="submit"
                  data-bs-dismiss="modal"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
