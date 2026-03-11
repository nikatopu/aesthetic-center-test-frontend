import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../store/GlobalContext";
import { useToast } from "../../components/atoms/Toast/ToastProvider";
import { SpecialistAPI } from "../../api/client";
import { Button } from "../../components/atoms/Button";
import { StaffModal } from "../../components/organisms/StaffModal";
import "./StaffPage.css";

const StaffPage = () => {
  const { specialists, refreshData } = useContext(GlobalContext);
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const filteredStaff = specialists.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.surname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (staff) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${staff.name} ${staff.surname}?`,
      )
    ) {
      setIsDeleting(staff.id);
      try {
        await SpecialistAPI.delete(staff.id);
        await refreshData();
        showSuccess(`${staff.name} ${staff.surname} deleted successfully!`);
      } catch (error) {
        showError("Error deleting staff member. Please try again.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  const handleSave = async () => {
    await refreshData();
    showSuccess(
      selectedStaff
        ? "Staff member updated successfully!"
        : "New staff member added successfully!",
    );
    closeModal();
  };

  return (
    <div className="staff-page">
      <div className="page-header">
        <h1>Staff Management</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Search by name or surname..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleAddNew}>+ Add New Staff</Button>
        </div>
      </div>

      {filteredStaff.length === 0 ? (
        <div className="empty-state">
          <h3>{searchTerm ? "No staff found" : "No staff members yet"}</h3>
          <p>
            {searchTerm
              ? "Try adjusting your search terms"
              : "Add your first staff member to get started"}
          </p>
        </div>
      ) : (
        <div className="staff-grid">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="staff-card">
              <div className="staff-header">
                <img
                  className="staff-avatar"
                  src={
                    staff.photo_url || "https://via.placeholder.com/64?text=👤"
                  }
                  alt={`${staff.name} ${staff.surname}`}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/64?text=👤";
                  }}
                />
                <div className="staff-info">
                  <div className="staff-name">
                    {staff.name} {staff.surname}
                  </div>
                  <div className="staff-title">Specialist</div>
                </div>
              </div>

              <div className="staff-actions">
                <button
                  className="action-btn edit"
                  onClick={() => handleEdit(staff)}
                  disabled={isDeleting === staff.id}
                >
                  ✏️ Edit
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(staff)}
                  disabled={isDeleting === staff.id}
                >
                  🗑️ {isDeleting === staff.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <StaffModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedStaff}
        onSave={handleSave}
      />
    </div>
  );
};

export default StaffPage;
