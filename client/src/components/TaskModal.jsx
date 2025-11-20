// src/components/TaskModal.jsx
import React, { useEffect, useRef } from "react";
import api from "../api/axiosconfig";

export default function TaskModal({ teamId, onCreated, editingTask, onUpdated }) {
  const formRef = useRef(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    if (editingTask) {
      form.title.value = editingTask.title || "";
      form.description.value = editingTask.description || "";
      form.dueDate.value = editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "";
      form.priority.value = editingTask.priority || "medium";
    } else {
      form.reset();
    }
  }, [editingTask]);

  const hideModalSafely = () => {
    try {
      const modalEl = document.getElementById("taskModal");
      if (modalEl && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    } catch (err) {
      console.error("modal hide failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const payload = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      dueDate: form.dueDate.value || null,
      priority: form.priority.value || "medium",
      teamId,
    };

    try {
      let res;
      if (editingTask && editingTask._id) {
        res = await api.patch(`/tasks/${editingTask._id}`, payload);
      } else {
        res = await api.post("/tasks", payload);
      }

      if (!(res.status === 201 || res.status === 200)) {
        throw new Error(res.data?.message || "Unexpected response");
      }

      // callbacks (don't allow them to bubble errors)
      try {
        if (editingTask && typeof onUpdated === "function") await onUpdated(res.data);
        if (!editingTask && typeof onCreated === "function") await onCreated(res.data);
      } catch (cbErr) {
        console.error("callback error:", cbErr);
      }

      hideModalSafely();
    } catch (err) {
      console.error("Task save error:", err);
      alert(err.response?.data?.message || err.message || "Failed to save task");
    }
  };

  return (
    <div className="modal fade" id="taskModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{editingTask ? "Edit Task" : "Create Task"}</h5>
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
                {editingTask ? "Save changes" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
