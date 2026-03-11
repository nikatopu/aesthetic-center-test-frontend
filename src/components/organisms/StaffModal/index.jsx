import React, { useState, useEffect, useRef } from "react";
import { Modal } from "../../atoms/Modal";
import { Button } from "../../atoms/Button";
import { useToast } from "../../atoms/Toast/ToastProvider";
import { SpecialistAPI } from "../../../api/client";
import "./StaffModal.css";

export const StaffModal = ({ isOpen, onClose, data, onSave }) => {
  const { showError } = useToast();
  const [form, setForm] = useState({ name: "", surname: "", photo_url: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setForm(data);
      setPreviewImage(data.photo_url);
    } else {
      setForm({ name: "", surname: "", photo_url: "" });
      setPreviewImage(null);
    }
  }, [data, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (data?.id) {
        await SpecialistAPI.update(data.id, form);
      } else {
        await SpecialistAPI.create(form);
      }
      onSave();
    } catch (error) {
      showError("Error saving staff member. Please try again.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // For demo purposes, we'll use a placeholder service
      // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
      const mockUploadUrl = `https://picsum.photos/200/200?random=${Date.now()}`;

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setForm({ ...form, photo_url: mockUploadUrl });
    } catch (error) {
      showError("Error uploading image. Please try again.");
      setPreviewImage(form.photo_url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, photo_url: "" });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={data?.id ? "Edit Staff Member" : "Add New Staff Member"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="staff-form">
        <div className="photo-section">
          <div className="photo-preview">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile preview"
                className="preview-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/120?text=👤";
                }}
              />
            ) : (
              <div className="placeholder-image">
                <span>📷</span>
                <p>No photo</p>
              </div>
            )}
          </div>

          <div className="photo-actions">
            <button
              type="button"
              onClick={triggerFileInput}
              className="upload-btn"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
            {previewImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="remove-btn"
                disabled={isUploading}
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">First Name *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Last Name *</label>
          <input
            id="surname"
            type="text"
            value={form.surname}
            onChange={(e) => setForm({ ...form, surname: e.target.value })}
            placeholder="Enter last name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo_url">Photo URL (Optional)</label>
          <input
            id="photo_url"
            type="url"
            value={form.photo_url}
            onChange={(e) => {
              setForm({ ...form, photo_url: e.target.value });
              setPreviewImage(e.target.value);
            }}
            placeholder="https://example.com/photo.jpg"
          />
          <small className="form-help">
            You can either upload a photo or provide a direct URL to an image
          </small>
        </div>

        <div className="modal-footer">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUploading}>
            {data?.id ? "Update Staff" : "Add Staff"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
