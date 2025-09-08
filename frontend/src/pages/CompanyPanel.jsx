import { useEffect, useState } from "react";
import { getCompanyTasks, createCompanyTask, updateCompanyTask, deleteCompanyTask, getCompanyUsers } from "../api/company";
import { logout } from "../api/auth";

export default function CompanyPanel() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority: "medium",
    due_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [tasksData, usersData] = await Promise.all([
        getCompanyTasks(),
        getCompanyUsers(),
      ]);
      setTasks(Array.isArray(tasksData?.data) ? tasksData.data : []);
      setUsers(Array.isArray(usersData?.data) ? usersData.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedTask(null);
    setForm({ title: "", description: "", assigned_to: "", priority: "medium", due_date: "" });
    setShowModal(true);
  }

  function openEditModal(task) {
    setModalMode("edit");
    setSelectedTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      assigned_to: task.assigned_to || "",
      priority: task.priority || "medium",
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await createCompanyTask(form);
      } else if (selectedTask) {
        await updateCompanyTask(selectedTask.id, form);
      }
      setShowModal(false);
      await fetchData();
      alert(modalMode === "create" ? "Task created successfully!" : "Task updated successfully!");
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Error saving task. Please try again.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteCompanyTask(id);
      await fetchData();
      alert("Task deleted successfully!");
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Error deleting task. Please try again.");
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assigned_user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="container">
          <div className="nav">
            <h1>Company Dashboard</h1>
            <div className="nav-buttons">
              <button onClick={openCreateModal} className="btn btn-primary">New Task</button>
              <button onClick={logout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="row" style={{ marginBottom: '30px' }}>
          <div className="col-3"><div className="card" style={{ textAlign: 'center' }}><h3 style={{ margin: '0 0 10px 0', color:'#007bff' }}>{tasks.length}</h3><p style={{ margin:0, color:'#666' }}>Total Tasks</p></div></div>
          <div className="col-3"><div className="card" style={{ textAlign: 'center' }}><h3 style={{ margin: '0 0 10px 0', color:'#ffc107' }}>{tasks.filter(t=>t.status==='pending').length}</h3><p style={{ margin:0, color:'#666' }}>Pending</p></div></div>
          <div className="col-3"><div className="card" style={{ textAlign: 'center' }}><h3 style={{ margin: '0 0 10px 0', color:'#17a2b8' }}>{tasks.filter(t=>t.status==='in-progress').length}</h3><p style={{ margin:0, color:'#666' }}>In Progress</p></div></div>
          <div className="col-3"><div className="card" style={{ textAlign: 'center' }}><h3 style={{ margin: '0 0 10px 0', color:'#28a745' }}>{tasks.filter(t=>t.status==='completed').length}</h3><p style={{ margin:0, color:'#666' }}>Completed</p></div></div>
        </div>

        {/* Search & Filter */}
        <div className="card">
          <div style={{ display:'flex', gap:'15px', marginBottom:'20px', flexWrap:'wrap' }}>
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="form-control" style={{ flex:1, minWidth:'200px' }} />
            <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="form-control" style={{ minWidth:'150px' }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {filteredTasks.length === 0 ? (
            <div style={{ textAlign:'center', padding:'30px', color:'#666' }}>
              {searchTerm || statusFilter !== 'all' ? 'No tasks found. Try adjusting your search or filter.' : 'No tasks yet. Click "New Task" to create one.'}
            </div>
          ) : (
            <div className="row">
              {filteredTasks.map((task) => (
                <div key={task.id} className="col-4">
                  <div className="card" style={{ height:'100%' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                      <div className="flex-1 min-w-0">
                        <h3 style={{ margin:0 }} className="truncate">{task.title}</h3>
                        <p style={{ color:'#666', margin:'4px 0 0 0' }} className="truncate">{task.description || 'No description'}</p>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:'4px', marginLeft:'8px' }}>
                        <span className={`badge ${task.status==='completed'?'badge-success':task.status==='in-progress'?'badge-info':'badge-warning'}`}>{task.status}</span>
                        <span className={`badge ${task.priority==='high'?'badge-danger':task.priority==='medium'?'badge-warning':'badge-success'}`}>{task.priority}</span>
                      </div>
                    </div>
                    {task.assigned_user?.name && (<div style={{ fontSize:'12px', color:'#666', marginBottom:'8px' }}>Assignee: {task.assigned_user.name}</div>)}
                    {task.due_date && (<div style={{ fontSize:'12px', color:'#666', marginBottom:'10px' }}>Due: {new Date(task.due_date).toLocaleDateString()}</div>)}
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={() => openEditModal(task)} className="btn btn-primary" style={{ flex:1 }}>Edit</button>
                      <button onClick={() => handleDelete(task.id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{modalMode === 'create' ? 'Create New Task' : 'Edit Task'}</h3>
                <button className="close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Task Title *</label>
                      <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-control" placeholder="Enter task title" />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="form-control" placeholder="Enter task description" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Assign To</label>
                      <select value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} className="form-control">
                        <option value="">Select user</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="form-control">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Due Date</label>
                      <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="form-control" />
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{modalMode === 'create' ? 'Create Task' : 'Update Task'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}