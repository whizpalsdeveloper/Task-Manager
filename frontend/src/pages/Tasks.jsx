import { useEffect, useMemo, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/tasks";
import { logout } from "../api/auth";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal state for create/edit/view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit' | 'view'
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    status: "pending",
    due_date: "",
  });

  async function fetchTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      const safeTasks = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setTasks(safeTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setModalMode("create");
    setForm({ id: null, title: "", description: "", status: "pending", due_date: "" });
    setIsModalOpen(true);
  }

  function openViewModal(task) {
    setModalMode("view");
    setForm({
      id: task.id,
      title: task.title || "",
      description: task.description || "",
      status: task.status || "pending",
      due_date: formatDateForInput(task.due_date),
    });
    setIsModalOpen(true);
  }

  function openEditModal(task) {
    setModalMode("edit");
    setForm({
      id: task.id,
      title: task.title || "",
      description: task.description || "",
      status: task.status || "pending",
      due_date: formatDateForInput(task.due_date),
    });
    setIsModalOpen(true);
  }

  async function handleSubmitModal(e) {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        status: form.status,
        due_date: form.due_date || null,
      };

      if (modalMode === "create") {
        await createTask(payload);
      } else if (modalMode === "edit" && form.id) {
        await updateTask(form.id, payload);
      }

      setIsModalOpen(false);
      await fetchTasks();
      alert(modalMode === "create" ? "Task created successfully!" : "Task updated successfully!");
    } catch (err) {
      if (err?.response?.status === 401) {
        alert("Session expired. Please login again.");
        await handleLogout();
        return;
      }
      alert("Failed to save task. Please try again.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      await fetchTasks();
      alert("Task deleted successfully!");
    } catch (err) {
      alert("Failed to delete task. Please try again.");
    }
  }

  async function handleLogout() {
    await logout();
    window.location.reload();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const statuses = [
    { key: "pending", label: "Pending" },
    { key: "in-progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  const tasksByStatus = useMemo(() => {
    const list = (searchTerm || statusFilter !== 'all') ? filteredTasks : tasks;
    return statuses.reduce((acc, s) => {
      acc[s.key] = list.filter((t) => t.status === s.key);
      return acc;
    }, {});
  }, [tasks, filteredTasks, searchTerm, statusFilter]);

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in-progress':
        return 'badge-info';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  function formatDateForInput(value) {
    if (!value) return "";
    // Accepts Date/string, returns YYYY-MM-DD
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  async function quickChangeStatus(task, newStatus) {
    if (task.status === newStatus) return;
    try {
      const payload = { status: newStatus };
      if (newStatus === "completed" && !task.due_date) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        payload.due_date = `${yyyy}-${mm}-${dd}`;
      }
      await updateTask(task.id, payload);
      await fetchTasks();
      alert("Task status updated successfully!");
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="container">
          <div className="nav">
            <h1>My Tasks</h1>
            <div className="nav-buttons">
              <button onClick={openCreateModal} className="btn btn-primary">New Task</button>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="row" style={{ marginBottom: '30px' }}>
          <div className="col-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{tasks.length}</h3>
              <p style={{ margin: 0, color: '#666' }}>Total Tasks</p>
            </div>
          </div>
          <div className="col-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>{tasks.filter(t => t.status === 'pending').length}</h3>
              <p style={{ margin: 0, color: '#666' }}>Pending</p>
            </div>
          </div>
          <div className="col-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#17a2b8' }}>{tasks.filter(t => t.status === 'in-progress').length}</h3>
              <p style={{ margin: 0, color: '#666' }}>In Progress</p>
            </div>
          </div>
          <div className="col-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>{tasks.filter(t => t.status === 'completed').length}</h3>
              <p style={{ margin: 0, color: '#666' }}>Completed</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card">
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ flex: 1, minWidth: '200px' }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>No tasks found</h3>
              <p>{searchTerm || statusFilter !== "all" ? 'Try adjusting your search or filter.' : 'Get started by creating a new task.'}</p>
              {!searchTerm && statusFilter === "all" && (
                <button onClick={openCreateModal} className="btn btn-primary" style={{ marginTop: '15px' }}>
                  New Task
                </button>
              )}
            </div>
          ) : (
            <div className="row" style={{ alignItems: 'stretch' }}>
              {statuses.map((s) => (
                <div key={s.key} className="col-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const json = e.dataTransfer.getData('application/json');
                    if (!json) return;
                    const dropped = JSON.parse(json);
                    quickChangeStatus(dropped, s.key);
                  }}
                >
                  <div className="card" style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0 }}>{s.label}</h3>
                      <span className="badge badge-info">{tasksByStatus[s.key]?.length || 0}</span>
                    </div>
                    {(tasksByStatus[s.key] || []).map((task) => (
                      <div key={task.id} className="card" style={{ marginBottom: '10px' }}
                           draggable
                           onDragStart={(e) => {
                             e.dataTransfer.setData('application/json', JSON.stringify(task));
                           }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <button onClick={() => openViewModal(task)} className="btn" style={{ background:'none', padding:0, color:'#007bff' }}>{task.title}</button>
                          <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
                        </div>
                        {task.description ? (
                          <p style={{ color: '#666', marginBottom: '8px' }}>{task.description}</p>
                        ) : null}
                        {task.due_date ? (
                          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Due: {formatDateForInput(task.due_date)}</p>
                        ) : null}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select className="form-control" value={task.status} onChange={(e) => quickChangeStatus(task, e.target.value)}>
                            {statuses.map((opt) => (
                              <option key={opt.key} value={opt.key}>{opt.label}</option>
                            ))}
                          </select>
                          <button onClick={() => openEditModal(task)} className="btn btn-primary">Edit</button>
                          <button onClick={() => handleDelete(task.id)} className="btn btn-danger">Delete</button>
                        </div>
                      </div>
                    ))}
                    {(tasksByStatus[s.key] || []).length === 0 ? (
                      <div style={{ color: '#666', fontSize: '12px' }}>No tasks</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  {modalMode === "create" ? "Create New Task" : modalMode === "edit" ? "Edit Task" : "Task Details"}
                </h3>
                <button className="close" onClick={() => setIsModalOpen(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmitModal}>
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    disabled={modalMode === "view"}
                    className="form-control"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    disabled={modalMode === "view"}
                    rows={3}
                    className="form-control"
                    placeholder="Enter task description"
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      disabled={modalMode === "view"}
                      className="form-control"
                    >
                      {statuses.map((opt) => (
                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      value={form.due_date}
                      onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                      disabled={modalMode === "view"}
                      className="form-control"
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  {modalMode !== "view" && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {modalMode === "create" ? "Create Task" : "Update Task"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
