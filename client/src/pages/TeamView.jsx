import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TaskModal from "../components/TaskModal.jsx";
import api from "../api/axiosconfig.js";

export default function TeamView() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // We need this state to support the Edit feature UI
  const [editingTask, setEditingTask] = useState(null);

  // Helper to normalize assignedTo (could be id string or object)
  const getAssignedId = (task) => {
    if (!task || !task.assignedTo) return "";
    // if assignedTo is an object with _id, use that, otherwise assume it's the id
    return task.assignedTo._id || task.assignedTo;
  };

  // --- BUSINESS LOGIC (EXACT COPY FROM YOUR CODE) ---

  const load = async () => {
    setLoading(true);
    try {
      const [teamRes, tasksRes] = await Promise.all([
        api.get(`/teams/${teamId}`),
        api.get(`/tasks/team/${teamId}`), // ✅ Your specific route preserved
      ]);
      setTeam(teamRes.data);
      // ✅ Your specific members mapping preserved
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

  const assignTask = async (taskId, memberId) => {
    try {
      // If clearing assignment, send null explicitly
      const payload = { assignedTo: memberId ? memberId : null };
      await api.patch(`/tasks/${taskId}`, payload);
      await load();
    } catch (err) {
      console.error("Assign failed:", err);
      alert(err.response?.data?.message || "Failed to assign task");
    }
  };

  const moveForward = async (task) => {
    const status = task.status;
    const next = status === "todo" ? "in-progress" : status === "in-progress" ? "done" : null;
    if (!next) return;
    try {
      await api.patch(`/tasks/${task._id}`, { status: next });
      await load();
    } catch (err) {
      console.error("Move failed:", err);
      alert(err.response?.data?.message || "Failed to move task");
    }
  };

  // Helper for UI Edit (Just opens the modal using bootstrap API)
  const handleEditClick = (task) => {
    setEditingTask(task);
    const modal = new window.bootstrap.Modal(document.getElementById("taskModal"));
    modal.show();
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "high": return "text-danger bg-danger-subtle border border-danger-subtle";
      case "medium": return "text-warning-emphasis bg-warning-subtle border border-warning-subtle";
      case "low": return "text-success bg-success-subtle border border-success-subtle";
      default: return "text-secondary bg-light border";
    }
  };

  if (loading && !team) return <div className="p-5 text-center text-muted">Loading workspace...</div>;

  return (
    <div className="fade-in-up pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1 small">
              <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted">Teams</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{team ? team.name : "Loading..."}</li>
            </ol>
          </nav>
          <h2 className="fw-bolder mb-0">{team ? team.name : "Team"}</h2>
        </div>
        <div className="d-flex gap-2">
           <button 
                className="btn btn-outline-brand shadow-sm bg-white" 
                data-bs-toggle="modal" 
                data-bs-target="#inviteModal"
            >
            <i className="bi bi-person-plus me-2"></i>Invite
          </button>
          
          {/* ✅ REVERTED: Uses data-bs-toggle so it opens reliably */}
          <button 
            className="btn btn-primary-brand shadow-sm" 
            data-bs-toggle="modal" 
            data-bs-target="#taskModal"
            onClick={() => setEditingTask(null)}
          >
            <i className="bi bi-plus-lg me-2"></i>Add Task
          </button>
        </div>
      </div>

      <div className="row g-4">
        {["todo", "in-progress", "done"].map((status) => (
          <div className="col-md-4" key={status}>
            <div className="bg-light rounded-4 p-3 h-100">
               {/* Column Header */}
              <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                <h6 className="text-uppercase fw-bold text-muted small mb-0 ls-wider">
                  {status.replace("-", " ")}
                </h6>
                <span className="badge bg-white text-muted border shadow-sm rounded-pill">
                  {tasks.filter((t) => t.status === status).length}
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                {tasks
                  .filter((t) => t.status === status)
                  .map((t) => (
                    <div className="card border-0 shadow-sm rounded-3 hover-lift-sm" key={t._id}>
                      <div className="card-body p-3">
                        
                        {/* Top Row: Priority & Menu */}
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className={`badge rounded-pill fw-normal ${getPriorityColor(t.priority)}`}>
                            {t.priority || "medium"}
                          </span>
                          
                          {/* Dropdown for Edit/Delete */}
                          <div className="dropdown">
                            <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
                                <i className="bi bi-three-dots"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm rounded-3">
                                <li>
                                    <button className="dropdown-item small" onClick={() => handleEditClick(t)}>
                                        Edit
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider"/></li>
                                <li>
                                    <button 
                                        className="dropdown-item small text-danger" 
                                        onClick={async () => {
                                            if (!confirm("Delete this task?")) return;
                                            try {
                                                await api.delete(`/tasks/${t._id}`);
                                                load();
                                            } catch (err) {
                                                alert(err.response?.data?.message || "Failed to delete task");
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            </ul>
                          </div>
                        </div>

                        {/* Title & Desc */}
                        <h6 className="card-title fw-bold mb-1 text-dark">{t.title}</h6>
                        <p className="card-text small text-muted mb-3">{t.description}</p>

                        {/* Assignment Section */}
                        <div className="bg-light rounded-3 p-2 mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                                <small className="text-muted fw-bold" style={{fontSize: '0.7rem'}}>
                                    {t.assignedTo ? "ASSIGNED" : "UNASSIGNED"}
                                </small>
                                {t.assignedTo && (
                                    <button 
                                        className="btn btn-link p-0 text-muted" 
                                        onClick={() => assignTask(t._id, null)} 
                                        style={{fontSize: '0.7rem'}} 
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            
                            {/* ✅ REVERTED: Uses your exact onChange logic */}
                            <select
                                className="form-select form-select-sm border-0 bg-transparent ps-0 fw-medium text-dark shadow-none"
                                onChange={(e) => {
                                    const memberId = e.target.value;
                                    if (!memberId) return;
                                    assignTask(t._id, memberId);
                                }}
                                value={getAssignedId(t) || ""} // <-- FIX: controlled per-task using normalized id
                                style={{cursor: 'pointer'}}
                            >
                                <option value="" className="text-muted">Assign member...</option>
                                {members.map((m) => (
                                <option value={m.id} key={m.id}>
                                    {m.name}
                                </option>
                                ))}
                            </select>
                            {/* Visual Confirmation of Assignee */}
                            {t.assignedTo && (
                                <div className="small fw-bold text-primary mt-1">
                                    <i className="bi bi-person-check-fill me-1"></i>
                                    {members.find(m => m.id === getAssignedId(t))?.name || "Unknown Member"}
                                </div>
                            )}
                        </div>

                        {/* Footer: Date & Move Action */}
                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                          <small className="text-muted" style={{fontSize: '0.75rem'}}>
                             {t.dueDate ? "Due " + new Date(t.dueDate).toLocaleDateString() : ""}
                          </small>

                          {status !== "done" ? (
                            <button
                                className="btn btn-sm btn-light text-primary fw-bold rounded-pill px-3"
                                onClick={() => moveForward(t)}
                                disabled={t.status === "done"}
                                title="Move to next stage"
                            >
                                Move <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                          ) : (
                             <span className="text-success small fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Done</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {tasks.filter((t) => t.status === status).length === 0 && (
                     <div className="text-center py-4 text-muted small border border-dashed rounded-3 opacity-50">
                        No tasks
                     </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <TaskModal 
        teamId={teamId} 
        onCreated={load} 
        editingTask={editingTask} 
        onUpdated={load} 
       />

      {/* Invite Modal - EXACT logic from your code */}
      <div className="modal fade" id="inviteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Invite Member</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            
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
                  e.target.reset(); 
                } catch (err) {
                  console.error("Invite failed:", err);
                  alert(err.response?.data?.message || "Invite failed");
                }
              }}
            >
              <div className="modal-body pt-3">
                 <p className="text-muted small mb-3">Enter the email address of the person you want to invite.</p>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <input name="email" className="form-control bg-light border-0" type="email" placeholder="colleague@example.com" required />
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button className="btn btn-light text-muted fw-bold" type="button" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-primary-brand fw-bold px-4" type="submit">
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
