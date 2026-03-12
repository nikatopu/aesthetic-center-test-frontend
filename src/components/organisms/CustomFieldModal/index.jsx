import React, { useState } from "react";
import { Modal } from "../../atoms/Modal";
import { Button } from "../../atoms/Button";
import { useToast } from "../../atoms/Toast/ToastProvider";
import "./CustomFieldModal.css";

export const CustomFieldModal = ({ isOpen, onClose, onSave }) => {
  const { showError } = useToast();
  const [fieldName, setFieldName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(fieldName.trim());
      setFieldName("");
      onClose();
    } catch (error) {
      showError("Error creating field. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFieldName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Add New Column" onClose={handleClose}>
      <div className="custom-field-modal">
        <form onSubmit={handleSubmit} className="field-form">
          <div className="form-group">
            <label htmlFor="fieldName">Field Name *</label>
            <input
              id="fieldName"
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Enter field name (e.g., Duration)"
              maxLength={50}
              required
              autoFocus
            />
          </div>

          <div className="modal-footer">
            <Button type="submit" disabled={!fieldName.trim() || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Field"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
