import { useEffect, useState } from "react";
import { getCompanies, createCompany, updateCompany, deleteCompany, getCompanyCustomers } from "../api/admin";
import { logout } from "../api/auth";
import { 
  BuildingOfficeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  UsersIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto"></div>
          <div className="text-2xl text-white mt-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-purple-200 mt-1">Company Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Company
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-6 py-3 border border-white/20 text-sm font-medium rounded-xl text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-300">Total Companies</p>
                <p className="text-3xl font-bold text-white">{companies.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-300">Active Companies</p>
                <p className="text-3xl font-bold text-white">
                  {companies.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-300">Inactive Companies</p>
                <p className="text-3xl font-bold text-white">
                  {companies.filter(c => c.status === 'inactive').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Companies List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
          <div className="px-6 py-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ChartBarIcon className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Companies</h2>
              </div>
              <div className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-white">No companies found</h3>
              <p className="mt-2 text-gray-300">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new company.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Company
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <div key={company.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <BuildingOfficeIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                          <p className="text-sm text-gray-300">{company.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {company.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {company.website && (
                        <div className="flex items-center text-sm text-gray-300">
                          <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{company.website}</span>
                        </div>
                      )}
                      {company.phone && (
                        <div className="flex items-center text-sm text-gray-300">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{company.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-300">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{company.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCustomers(company)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-white/20 text-sm font-medium rounded-xl text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                      >
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        Customers
                      </button>
                      <button
                        onClick={() => openEditModal(company)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-white/20 text-sm font-medium rounded-xl text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="inline-flex items-center justify-center px-3 py-2 border border-red-500/20 text-sm font-medium rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Company Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-2xl rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {modalMode === "create" ? "Add New Company" : "Edit Company"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="company@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter company address"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-white/20 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    {modalMode === "create" ? "Create Company" : "Update Company"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Customers Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-2xl rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Customers - {selectedCompany.name}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {customers.length} {customers.length === 1 ? 'customer' : 'customers'}
                  </p>
                </div>
                <button
                  onClick={closeCustomersModal}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {customers.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-white">No customers</h3>
                  <p className="mt-2 text-gray-300">This company has no customers yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{customer.name}</p>
                          <p className="text-sm text-gray-300">{customer.email}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                        {customer.role}
                      </span>
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