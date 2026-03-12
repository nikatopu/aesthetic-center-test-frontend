import { useState, useEffect } from "react";
import { Modal } from "../../atoms/Modal";
import { Button } from "../../atoms/Button";
import { useToast } from "../../atoms/Toast/ToastProvider";
import {  useGlobalContext } from "../../../store/GlobalContext";
import { ServiceAPI } from "../../../api/client";
import "./ServiceModal.css";

const PREDEFINED_COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#f97316", // Orange
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f43f5e", // Rose
];

export const ServiceModal = ({ isOpen, onClose, data, onSave }) => {
  const { customFields, refreshData } = useGlobalContext();
  const { showError } = useToast();
  const [form, setForm] = useState({
    name: "",
    price: "",
    color: PREDEFINED_COLORS[0],
    customValues: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data?.id) {
      const initialValues = {};
      data.customFields?.forEach((v) => (initialValues[v.field_id] = v.value));
      setForm({ ...data, customValues: initialValues });
    } else {
      setForm({
        name: "",
        price: "",
        color: PREDEFINED_COLORS[0],
        customValues: {},
      });
    }
  }, [data, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (data?.id) {
        await ServiceAPI.update(data.id, form);
      } else {
        await ServiceAPI.create(form);
      }

      if (onSave) {
        onSave();
      } else {
        await refreshData();
        onClose();
      }
    } catch (err) {
      showError(
        "Error saving service: " + (err.response?.data?.error || err.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      price: "",
      color: PREDEFINED_COLORS[0],
      customValues: {},
    });
    onClose();
  };

  const updateCustomValue = (fieldId, value) => {
    setForm({
      ...form,
      customValues: {
        ...form.customValues,
        [fieldId]: value,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={data?.id ? "Edit Service" : "Add New Service"}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="serviceName">Service Name *</label>
            <input
              id="serviceName"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter service name"
              maxLength={100}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="servicePrice">Price ($) *</label>
            <input
              id="servicePrice"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Color (Schedule Block) *</label>
          <div className="color-palette">
            {PREDEFINED_COLORS.map((color) => (
              <div
                key={color}
                className={`color-swatch ${form.color === color ? "active" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => setForm({ ...form, color })}
                title={color}
              />
            ))}
          </div>
          <small className="color-help">
            This color will be used for reservation blocks in the schedule
          </small>
        </div>

        {/* Dynamic Custom Fields */}
        {customFields.length > 0 && (
          <div className="custom-fields-section">
            <h4>Custom Fields</h4>
            <div className="custom-fields-grid">
              {customFields.map((field) => (
                <div className="form-group" key={field.id}>
                  <label htmlFor={`custom-${field.id}`}>{field.label}</label>
                  <input
                    id={`custom-${field.id}`}
                    type="text"
                    value={form.customValues[field.id] || ""}
                    onChange={(e) =>
                      updateCustomValue(field.id, e.target.value)
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    maxLength={200}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.name.trim() || !form.price}
          >
            {isSubmitting
              ? "Saving..."
              : data?.id
                ? "Update Service"
                : "Create Service"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
