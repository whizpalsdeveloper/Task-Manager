import api from "./axios";

// Company management
export async function getCompanies() {
  const { data } = await api.get("/admin/companies");
  return data;
}

export async function createCompany(companyData) {
  const { data } = await api.post("/admin/companies", companyData);
  return data;
}

export async function updateCompany(id, companyData) {
  const { data } = await api.put(`/admin/companies/${id}`, companyData);
  return data;
}

export async function deleteCompany(id) {
  const { data } = await api.delete(`/admin/companies/${id}`);
  return data;
}

export async function getCompanyCustomers(companyId) {
  const { data } = await api.get(`/admin/companies/${companyId}/customers`);
  return data;
}
