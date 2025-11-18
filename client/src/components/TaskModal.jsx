// src/components/TaskModal.jsx
import React from "react";
import api from "../api/axiosConfig.js";

export default function TaskModal({ teamId, onCreated }) {
  // Create task and handle UI actions *after* ensuring the API succeeded.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const dueDate = form.dueDate.value || null;
    const priority = form.priority.value || "medium";

    try {
      const res = await api.post("/tasks", { title, description, dueDate, priority, teamId });

      // ensure the server returned success
      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Unexpected response from server");
      }

      // safely call onCreated (if provided) and hide modal without letting errors bubble to outer catch
      try {
        if (typeof onCreated === "function") await onCreated();
      } catch (innerErr) {
        console.error("onCreated callback failed:", innerErr);
      }

      // hide modal safely (only if the element exists and bootstrap is available)
      try {
        const modalEl = document.getElementById("taskModal");
        if (modalEl && window.bootstrap && typeof window.bootstrap.Modal === "function") {
          const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
        }
      } catch (hideErr) {
        console.error("Failed to hide modal:", hideErr);
      }
    } catch (err) {
      // show a helpful message (server message if available)
      console.error("Create task error:", err);
      alert(err.response?.data?.message || err.message || "Failed to create task");
    }
  };

  return (
    <div className="modal fade" id="taskModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create Task</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input name="title" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Due date</label>
                <input name="dueDate" type="date" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Priority</label>
                <select name="priority" className="form-select" defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
  );
}
