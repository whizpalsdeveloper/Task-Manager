import { useEffect, useState } from "react";
import { getCompanies, createCompany, updateCompany, deleteCompany, getCompanyCustomers } from "../api/admin";
import { logout } from "../api/auth";
// Simplified UI – no external icon libraries

export default function AdminPanel() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    status: "active",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomers(companyId) {
    try {
      const data = await getCompanyCustomers(companyId);
      setCustomers(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  }

  function openCreateModal() {
    setModalMode("create");
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      status: "active",
    });
    setShowModal(true);
  }

  function openEditModal(company) {
    setModalMode("edit");
    setForm({
      name: company.name,
      email: company.email,
      phone: company.phone || "",
      address: company.address || "",
      website: company.website || "",
      status: company.status,
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await createCompany(form);
      } else {
        await updateCompany(selectedCompany.id, form);
      }
      setShowModal(false);
      fetchCompanies();
      alert(modalMode === "create" ? "Company created successfully!" : "Company updated successfully!");
    } catch (err) {
      console.error("Error saving company:", err);
      alert("Error saving company. Please try again.");
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompany(id);
        fetchCompanies();
        alert("Company deleted successfully!");
      } catch (err) {
        console.error("Error deleting company:", err);
        alert("Error deleting company. Please try again.");
      }
    }
  }

  async function handleViewCustomers(company) {
    setSelectedCompany(company);
    await fetchCustomers(company.id);
  }

  function closeCustomersModal() {
    setSelectedCompany(null);
    setCustomers([]);
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1>Admin Dashboard</h1>
            <div className="nav-buttons">
              <button onClick={openCreateModal} className="btn btn-primary">Add Company</button>
              <button onClick={logout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="row" style={{ marginBottom: '30px' }}>
          <div className="col-4">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{companies.length}</h3>
              <p style={{ margin: 0, color: '#666' }}>Total Companies</p>
            </div>
          </div>
          <div className="col-4">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>{companies.filter(c => c.status === 'active').length}</h3>
              <p style={{ margin: 0, color: '#666' }}>Active</p>
            </div>
          </div>
          <div className="col-4">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>{companies.filter(c => c.status === 'inactive').length}</h3>
              <p style={{ margin: 0, color: '#666' }}>Inactive</p>
            </div>
          </div>
        </div>

        {/* Search & list */}
        <div className="card">
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
            <h2 style={{ margin: 0, flex: 1 }}>Companies ({filteredCompanies.length})</h2>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ maxWidth: '300px' }}
            />
          </div>

          {filteredCompanies.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '30px' }}>
              {searchTerm ? 'No companies match your search.' : 'No companies yet. Click "Add Company" to create one.'}
            </div>
          ) : (
            <div className="row">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="col-4">
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ margin: 0 }}>{company.name}</h3>
                        <div style={{ color: '#666', fontSize: '12px' }}>{company.email}</div>
                      </div>
                      <span className={`badge ${company.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{company.status}</span>
                    </div>
                    {company.website && (<div style={{ color: '#666', fontSize: '12px', marginBottom: '6px' }}>Website: {company.website}</div>)}
                    {company.phone && (<div style={{ color: '#666', fontSize: '12px', marginBottom: '6px' }}>Phone: {company.phone}</div>)}
                    <div style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>Email: {company.email}</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleViewCustomers(company)} className="btn btn-secondary" style={{ flex: 1 }}>Customers</button>
                      <button onClick={() => openEditModal(company)} className="btn btn-primary" style={{ flex: 1 }}>Edit</button>
                      <button onClick={() => handleDelete(company.id)} className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Company Form Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{modalMode === 'create' ? 'Add New Company' : 'Edit Company'}</h3>
                <button className="close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Company Name *</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-control" placeholder="Enter company name" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-control" placeholder="company@example.com" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-control" placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="form-control" placeholder="https://example.com" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-control">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="form-control" placeholder="Enter company address" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{modalMode === 'create' ? 'Create Company' : 'Update Company'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Customers Modal */}
        {selectedCompany && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Customers - {selectedCompany.name}</h3>
                <button className="close" onClick={closeCustomersModal}>×</button>
              </div>
              {customers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No customers</div>
              ) : (
                <div>
                  {customers.map((customer) => (
                    <div key={customer.id} className="card" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{customer.name}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>{customer.email}</div>
                        </div>
                        <span className="badge badge-info">{customer.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}