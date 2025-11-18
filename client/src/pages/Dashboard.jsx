import React, { useEffect, useState } from "react";
import api from "../api/axiosconfig.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api
      .get("/teams")
      .then((res) => setTeams(res.data))
      .catch(() => setTeams([]));
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Teams</h3>
        <button className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#createTeamModal">
          + New Team
        </button>
      </div>

      <div className="row">
        {teams.length === 0 && <div className="col-12">You are not in any teams yet.</div>}
        {teams.map((t) => (
          <div className="col-md-4" key={t._id}>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{t.name}</h5>
                <p className="card-text">{t.description}</p>
                <Link to={`/teams/${t._id}`} className="btn btn-sm btn-outline-primary">
                  Open
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal (basic) */}
      <div className="modal fade" id="createTeamModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const name = form.name.value;
                const description = form.description.value;
                try {
                  await api.post("/teams", { name, description });
                  // simple refresh
                  const res = await api.get("/teams");
                  setTeams(res.data);
                  // close modal programmatically
                  const modalEl = document.getElementById("createTeamModal");
                  const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
                  modal.hide();
                } catch (err) {
                  alert(err.response?.data?.message || "Failed to create team");
                }
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Create team</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Team name</label>
                  <input name="name" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-control" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
