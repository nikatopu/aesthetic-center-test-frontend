import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const SpecialistAPI = {
  getAll: (search) => client.get("/specialists", { params: { search } }),
  create: (data) => client.post("/specialists", data),
  update: (id, data) => client.put(`/specialists/${id}`, data),
  delete: (id) => client.delete(`/specialists/${id}`),
};

export const ServiceAPI = {
  getAll: () => client.get("/services"),
  getFields: () => client.get("/services/fields"),
  createField: (label) => client.post("/services/fields", { label }),
  deleteField: (id) => client.delete(`/services/fields/${id}`),
  updateFieldOrder: (orders) =>
    client.put("/services/fields/order", { orders }),
  create: (data) => client.post("/services", data),
  update: (id, data) => client.put(`/services/${id}`, data),
  delete: (id) => client.delete(`/services/${id}`),
};

export const ReservationAPI = {
  getByDate: (date) => client.get("/reservations", { params: { date } }),
  create: (data) => client.post("/reservations", data),
  update: (id, data) => client.put(`/reservations/${id}`, data),
  delete: (id) => client.delete(`/reservations/${id}`),
};
