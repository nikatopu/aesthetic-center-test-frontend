import { useState, useEffect } from "react";
import { useGlobalContext } from "../../store/GlobalContext";
import { useToast } from "../../components/atoms/Toast/ToastProvider";
import { ServiceAPI } from "../../api/client";
import { Button } from "../../components/atoms/Button";
import { ServiceModal } from "../../components/organisms/ServiceModal";
import { CustomFieldModal } from "../../components/organisms/CustomFieldModal";
import "./ServicesPage.css";

const ServicesPage = () => {
  const { services, customFields, refreshData } = useGlobalContext();
  const { showSuccess, showError } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [columnOrder, setColumnOrder] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [columnDropdowns, setColumnDropdowns] = useState({});

  // Initialize column order
  useEffect(() => {
    const savedOrder = localStorage.getItem("services-column-order");
    if (savedOrder) {
      const parsed = JSON.parse(savedOrder);
      const validOrder = parsed.filter((id) =>
        customFields.some((f) => f.id === id),
      );
      const newFields = customFields.filter((f) => !validOrder.includes(f.id));
      setColumnOrder([...validOrder, ...newFields.map((f) => f.id)]);
    } else {
      setColumnOrder(customFields.map((f) => f.id));
    }
  }, [customFields]);

  // Save column order to localStorage
  useEffect(() => {
    if (columnOrder.length > 0) {
      localStorage.setItem(
        "services-column-order",
        JSON.stringify(columnOrder),
      );
    }
  }, [columnOrder]);

  // --- Search Logic ---
  const filteredServices = services.filter((service) => {
    const searchLower = searchTerm.toLowerCase();

    // Check main name
    const matchesName = service.name.toLowerCase().includes(searchLower);

    // Check custom field values
    const matchesCustomFields = service.customFields?.some((cf) =>
      cf.value?.toLowerCase().includes(searchLower),
    );

    return matchesName || matchesCustomFields;
  });

  const handleCreateField = async (fieldName) => {
    await ServiceAPI.createField(fieldName);
    await refreshData();
    showSuccess(`Custom field "${fieldName}" created successfully!`);
  };

  const handleDeleteField = async (field) => {
    const confirmMessage = `Are you sure you want to delete the "${field.label}" field?\n\nThis will permanently remove this field and all its data from all services. This action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      try {
        await ServiceAPI.deleteField(field.id);

        // Update column order to remove deleted field
        setColumnOrder((prev) => prev.filter((id) => id !== field.id));

        await refreshData();
        showSuccess(`Custom field "${field.label}" deleted successfully!`);

        // Close any open dropdown
        setColumnDropdowns({});
      } catch (error) {
        showError("Error deleting field. Please try again.");
      }
    }
  };

  const toggleColumnDropdown = (fieldId) => {
    setColumnDropdowns((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const closeAllDropdowns = () => {
    setColumnDropdowns({});
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAddNew = () => {
    setSelectedService(null);
    setIsServiceModalOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      setIsDeleting(service.id);
      try {
        await ServiceAPI.delete(service.id);
        await refreshData();
        showSuccess(`Service "${service.name}" deleted successfully!`);
      } catch (error) {
        showError("Error deleting service. Please try again.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleServiceSave = async () => {
    await refreshData();
    showSuccess(
      selectedService
        ? "Service updated successfully!"
        : "New service created successfully!",
    );
    closeServiceModal();
  };

  // Drag and Drop handlers
  const handleColumnDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleColumnDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleColumnDrop = (e, targetColumnId) => {
    e.preventDefault();

    if (draggedColumn === targetColumnId) return;

    const currentOrder = [...columnOrder];
    const draggedIndex = currentOrder.indexOf(draggedColumn);
    const targetIndex = currentOrder.indexOf(targetColumnId);

    // Remove dragged item
    currentOrder.splice(draggedIndex, 1);
    // Insert at new position
    currentOrder.splice(targetIndex, 0, draggedColumn);

    setColumnOrder(currentOrder);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Get ordered custom fields
  const orderedCustomFields = columnOrder
    .map((id) => customFields.find((f) => f.id === id))
    .filter(Boolean);

  return (
    <div className="services-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Services</h1>

          <Button onClick={handleAddNew} variant="secondary">
            + Add new
          </Button>
        </div>

        <input
          type="text"
          placeholder="Search by name or custom fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredServices.length === 0 && searchTerm ? (
        <div className="empty-state">
          <h3>No services found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="services-table">
            <thead>
              <tr>
                <th>Service</th>
                <th className="services-price-head">Price</th>
                {orderedCustomFields.map((field) => (
                  <th
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleColumnDragStart(e, field.id)}
                    onDragOver={(e) => handleColumnDragOver(e, field.id)}
                    onDragLeave={handleColumnDragLeave}
                    onDrop={(e) => handleColumnDrop(e, field.id)}
                    onDragEnd={handleColumnDragEnd}
                    className={`
                      custom-field-header
                      ${draggedColumn === field.id ? "dragging" : ""}
                      ${dragOverColumn === field.id ? "drop-target" : ""}
                    `}
                  >
                    <div className="column-header-content">
                      <span className="column-drag-handle">⋮⋮</span>
                      <span className="column-label">{field.label}</span>
                      <button
                        type="button"
                        className="column-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleColumnDropdown(field.id);
                        }}
                        title="Field options"
                      >
                        ⋯
                      </button>
                      {columnDropdowns[field.id] && (
                        <div
                          className="column-dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="dropdown-item delete"
                            onClick={() => handleDeleteField(field)}
                          >
                            🗑️ Delete Field
                          </button>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                <th className="action-col">
                  <Button variant="secondary" onClick={() => setIsFieldModalOpen(true)}> 
                    +</Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-name-cell">
                        <span
                          className="color-indicator"
                          style={{ backgroundColor: service.color }}
                        />
                        {service.name}
                      </div>
                    </td>
                    <td className="price-cell">
                      ${Number(service.price).toFixed(2)}
                    </td>
                    {orderedCustomFields.map((field) => {
                      const val = service.customFields?.find(
                        (v) => v.field_id === field.id,
                      );
                      return <td key={field.id}>{val ? val.value : "-"}</td>;
                    })}
                    <td>
                      <div className="item-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => handleEdit(service)}
                          disabled={isDeleting === service.id}
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(service)}
                          disabled={isDeleting === service.id}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={orderedCustomFields.length + 3}
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#6b7280",
                    }}
                  >
                    {services.length === 0
                      ? "No services yet. Add your first service to get started."
                      : "No services found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={closeServiceModal}
        data={selectedService}
        onSave={handleServiceSave}
      />

      <CustomFieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onSave={handleCreateField}
      />
    </div>
  );
};

export default ServicesPage;
