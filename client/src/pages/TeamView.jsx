// src/pages/TeamView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskModal from "../components/TaskModal.jsx";
import api from "../api/axiosconfig.js";

export default function TeamView() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]); // simplified members list for assign dropdown
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [teamRes, tasksRes] = await Promise.all([
        api.get(`/teams/${teamId}`),
        api.get(`/tasks/team/${teamId}`),
      ]);
      setTeam(teamRes.data);
      setMembers((teamRes.data?.members || []).map((m) => ({ id: m.user._id || m.user, name: m.user.name || m.user })));
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Load team view error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  // assign a task to a member id
  const assignTask = async (taskId, memberId) => {
    try {
      await api.patch(`/tasks/${taskId}`, { assignedTo: memberId });
      await load();
    } catch (err) {
      console.error("Assign failed:", err);
      alert(err.response?.data?.message || "Failed to assign task");
    }
  };

  // move status forward only (todo -> in-progress -> done). If done, do nothing.
  const moveForward = async (task) => {
    const status = task.status;
    const next = status === "todo" ? "in-progress" : status === "in-progress" ? "done" : null;
    if (!next) return; // no-op if already done
    try {
      await api.patch(`/tasks/${task._id}`, { status: next });
      await load();
    } catch (err) {
      console.error("Move failed:", err);
      alert(err.response?.data?.message || "Failed to move task");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{team ? team.name : "Team"}</h3>
        <div>
          <button className="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#taskModal">
            + Task
          </button>
          <button className="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#inviteModal">
            Invite
          </button>
        </div>
      </div>

      {loading && <div>Loading...</div>}

      <div className="row">
        {["todo", "in-progress", "done"].map((status) => (
          <div className="col-md-4" key={status}>
            <h6 className="text-capitalize">{status.replace("-", " ")}</h6>
            {tasks
              .filter((t) => t.status === status)
              .map((t) => (
                <div className="card mb-2" key={t._id}>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{t.title}</h6>
                    <p className="card-text small">{t.description}</p>

                    {/* Assigned UI: show dropdown to assign */}
                    <div className="mb-2 d-flex align-items-center flex-wrap">
                      <small className="me-2">
                        {t.assignedTo ? "Assigned To" : "Unassigned"}
                      </small>

                      <select
                        className="form-select form-select-sm w-auto me-2"
                        onChange={(e) => {
                          const memberId = e.target.value;
                          if (!memberId) return;
                          assignTask(t._id, memberId);
                        }}
                        defaultValue=""
                      >
                        <option value="">Assign</option>
                        {members.map((m) => (
                          <option value={m.id} key={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      {/* quick button to clear assignment */}
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => assignTask(t._id, null)}
                        title="Unassign"
                      >
                        Unassign
                      </button>
                    </div>

                    {/* Due Date + Priority Row */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        {t.dueDate
                          ? "Due: " + new Date(t.dueDate).toLocaleDateString()
                          : "No due date"}
                      </small>

                      <span
                        className={
                          "badge " +
                          (t.priority === "high"
                            ? "bg-danger"
                            : t.priority === "medium"
                              ? "bg-warning text-dark"
                              : "bg-success")
                        }
                      >
                        {t.priority}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small>
                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ""}
                      </small>

                      <div>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => moveForward(t)}
                          disabled={t.status === "done"}
                          title={
                            t.status === "done"
                              ? "Task is complete"
                              : "Move to next stage"
                          }
                        >
                          Move
                        </button>

                        {/* open details / comments could be another modal or route */}
                        {/* <button
                          className="btn btn-sm btn-outline-info"
                          data-bs-toggle="modal"
                          data-bs-target="#taskModal"
                        >
                          Edit
                        </button> */}
                        <button
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={async () => {
                            if (!confirm("Delete this task?")) return;

                            try {
                              await api.delete(`/tasks/${t._id}`);
                              load(); // refresh tasks
                            } catch (err) {
                              alert(err.response?.data?.message || "Failed to delete task");
                            }
                          }}
                        >
                          Delete
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

        ))}
      </div>

      {/* Task Modal */}
      <TaskModal teamId={teamId} onCreated={load} />

      {/* Invite modal (same as before) */}
      <div className="modal fade" id="inviteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const email = e.target.email.value.trim();
                try {
                  await api.post(`/teams/${teamId}/invite`, { email });
                  alert("Invited");
                  await load();
                  const modalEl = document.getElementById("inviteModal");
                  if (modalEl && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
                } catch (err) {
                  console.error("Invite failed:", err);
                  alert(err.response?.data?.message || "Invite failed");
                }
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Invite member</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" className="form-control" type="email" required />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
