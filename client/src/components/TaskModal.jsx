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
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg">
            
          {/* Header */}
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold">
                {editingTask ? "Edit Task" : "Create New Task"}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="modal-body pt-3">
              <p className="text-muted small mb-4">
                  {editingTask ? "Update the details for this task below." : "Add a new task to your board."}
              </p>

              {/* Title */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Title</label>
                <input 
                    name="title" 
                    className="form-control bg-light border-0" 
                    placeholder="e.g. Redesign Homepage"
                    required 
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Description</label>
                <textarea 
                    name="description" 
                    className="form-control bg-light border-0" 
                    rows="3"
                    placeholder="Add more details..."
                />
              </div>

              <div className="row">
                  {/* Due Date */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold text-muted">Due date</label>
                    <input 
                        name="dueDate" 
                        type="date" 
                        className="form-control bg-light border-0" 
                    />
                  </div>

                  {/* Priority */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold text-muted">Priority</label>
                    <select 
                        name="priority" 
                        className="form-select bg-light border-0" 
                        defaultValue="medium"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top-0">
              <button 
                className="btn btn-light text-muted fw-bold" 
                type="button" 
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-primary-brand fw-bold px-4" type="submit">
                {editingTask ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}