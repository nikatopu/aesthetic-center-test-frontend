import React, { useState, useEffect, useRef } from "react";
import { Modal } from "../../atoms/Modal";
import { Button } from "../../atoms/Button";
import { useToast } from "../../atoms/Toast/ToastProvider";
import { SpecialistAPI } from "../../../api/client";
import "./StaffModal.css";

export function StaffModal({ isOpen, onClose, data, onSave }) {
  const { showError } = useToast();
  const [form, setForm] = useState({ name: "", surname: "", photo_url: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(
    function () {
      if (data) {
        setForm(data);
        setPreviewImage(data.photo_url);
        setUploadedFileName("");
      } else {
        setForm({ name: "", surname: "", photo_url: "" });
        setPreviewImage(null);
        setUploadedFileName("");
      }
    },
    [data, isOpen],
  );

  async function handleSubmit(e) {
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
  }

  async function handleFileUpload(e) {
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
    setUploadedFileName(file.name);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = function (e) {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // For demo purposes, we'll use a placeholder service
      // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
      const mockUploadUrl = `https://picsum.photos/200/200?random=${Date.now()}`;

      // Simulate upload delay
      await new Promise(function (resolve) {
        setTimeout(resolve, 1500);
      });

      setForm({ ...form, photo_url: mockUploadUrl });
    } catch (error) {
      showError("Error uploading image. Please try again.");
      setPreviewImage(form.photo_url);
      setUploadedFileName("");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveImage() {
    setForm({ ...form, photo_url: "" });
    setPreviewImage(null);
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function triggerFileInput() {
    fileInputRef.current?.click();
  }

  return (
    <Modal
      isOpen={isOpen}
      title={data?.id ? "Edit Staff Member" : "Add New Staff Member"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="staff-form">
        <div className="form-content">
          <div className="form-left-column">
            <div className="form-group">
              <label htmlFor="name">First Name *</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={function (e) {
                  setForm({ ...form, name: e.target.value });
                }}
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
                onChange={function (e) {
                  setForm({ ...form, surname: e.target.value });
                }}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="form-right-column">
            <div className="photo-upload-section">
              <div
                className={`photo-upload-area ${previewImage ? "has-image" : ""}`}
                onClick={triggerFileInput}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="preview-image"
                    onError={function (e) {
                      e.target.src = "https://via.placeholder.com/120?text=👤";
                    }}
                  />
                ) : (
                  <div className="upload-placeholder">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3498db"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21,15 16,10 5,21" />
                    </svg>
                    <span>Add Photo</span>
                  </div>
                )}
              </div>

              {uploadedFileName && (
                <div className="file-info">
                  <span className="file-name">{uploadedFileName}</span>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button type="submit" disabled={isUploading}>
            {data?.id ? "Update Staff" : "Add Staff"}
          </Button>

          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </form>
    </Modal>
  );
}
