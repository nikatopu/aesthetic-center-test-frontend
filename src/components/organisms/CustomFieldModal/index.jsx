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
    <Modal isOpen={isOpen} title="Add Custom Field" onClose={handleClose}>
      <div className="custom-field-modal">
        <div className="field-explanation">
          <p>
            Create a new custom field that will appear as a column in your
            services table. This allows you to track additional information for
            each service.
          </p>
          <div className="examples">
            <strong>Examples:</strong>
            <ul>
              <li>Duration</li>
              <li>Category</li>
              <li>Skill Level</li>
              <li>Equipment Needed</li>
            </ul>
          </div>
        </div>

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
            <div className="field-requirements">
              <small>
                • Must be between 1-50 characters
                <br />
                • Use clear, descriptive names
                <br />• Cannot be changed after creation
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!fieldName.trim() || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Field"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
