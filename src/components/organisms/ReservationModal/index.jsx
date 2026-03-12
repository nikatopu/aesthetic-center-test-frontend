import { useState, useEffect } from "react";
import { Modal } from "../../atoms/Modal";
import { Button } from "../../atoms/Button";
import { useGlobalContext } from "../../../store/GlobalContext";
import { validateServiceIds } from "../../../utils/reservationUtils";
import { EmptyState } from "../../atoms/EmptyState";
import "./ReservationModal.css";

export const ReservationModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  onDelete,
}) => {
  const { services, specialists } = useGlobalContext();
  const [serviceSearch, setServiceSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasDeletedServices, setHasDeletedServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  // Provide default values to prevent null/undefined errors
  const getDefaultFormData = () => ({
    specialist_id: null,
    start_time: "",
    reservation_date: new Date().toISOString().split("T")[0],
    duration_minutes: 60,
    service_ids: [],
    ...initialData,
  });

  const [formData, setFormData] = useState(getDefaultFormData());

  // Update form data when initialData changes
  useEffect(() => {
    const defaultData = getDefaultFormData();

    // Check for deleted services if editing existing reservation
    if (initialData?.service_ids) {
      const validation = validateServiceIds(initialData.service_ids, services);
      setHasDeletedServices(validation.hasDeleted);

      // Update form data with only valid service IDs
      setFormData({
        ...defaultData,
        service_ids: validation.validIds,
      });

      // Set selected services for display
      const validServices = services.filter((service) =>
        validation.validIds.includes(service.id),
      );
      setSelectedServices(validServices);
    } else {
      setFormData(defaultData);
      setHasDeletedServices(false);
      setSelectedServices([]);
    }

    setServiceSearch("");
    setShowDeleteConfirm(false);
  }, [initialData, services]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(formData.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  // Safety Check: If no services exist, the user shouldn't be able to save
  const hasNoServices = !services || services.length === 0;

  // Filter services based on search
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase()),
  );

  // Duration options
  const durationOptions = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
    { value: 180, label: "3 hours" },
    { value: 240, label: "4 hours" },
  ];

  // Generate time options for appointment time dropdown
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeValue = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const timeLabel = new Date(
          `1970-01-01T${timeValue}:00`,
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        times.push({ value: timeValue, label: timeLabel });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Add service to selected list
  const addService = (service) => {
    if (!selectedServices.find((s) => s.id === service.id)) {
      const newSelectedServices = [...selectedServices, service];
      setSelectedServices(newSelectedServices);
      setFormData({
        ...formData,
        service_ids: newSelectedServices.map((s) => s.id),
      });
    }
    setServiceSearch("");
  };

  // Remove service from selected list
  const removeService = (serviceId) => {
    const newSelectedServices = selectedServices.filter(
      (s) => s.id !== serviceId,
    );
    setSelectedServices(newSelectedServices);
    setFormData({
      ...formData,
      service_ids: newSelectedServices.map((s) => s.id),
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedServices
      .reduce((total, service) => total + parseFloat(service.price || 0), 0)
      .toFixed(2);
  };

  // Get selected specialist name
  const getSpecialistName = () => {
    const specialist = specialists.find((s) => s.id === formData.specialist_id);
    return specialist ? specialist.name : "No specialist selected";
  };

  return (
    <Modal
      isOpen={isOpen}
      title={formData?.id ? "Edit Reservation" : "New Reservation"}
      onClose={onClose}
    >
      {hasNoServices ? (
        <EmptyState
          message="No services found. Please create services first."
          linkText="Go to Services"
          linkTo="services"
        />
      ) : (
        <form onSubmit={handleSubmit} className="reservation-form">
          {/* First Row - Selected Specialist */}
          <div className="form-row specialist-row">
            <div className="form-group">
              <label htmlFor="specialist">Name</label>
              <div className="specialist-display">
                {formData.specialist_id ? (
                  getSpecialistName()
                ) : (
                  <select
                    id="specialist"
                    value={formData.specialist_id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialist_id: parseInt(e.target.value),
                      })
                    }
                    required
                  >
                    <option value="">Select Specialist</option>
                    {specialists.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Second Row - Date, Appt. Time, Duration with SVG icons */}
          <div className="form-row details-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <div className="input-with-icon">
                <input
                  id="date"
                  type="date"
                  value={formData.reservation_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reservation_date: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="time">Appt. Time</label>
              <div className="input-with-icon">
                <svg
                  className="input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#3498db"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.0059 6.99805V11.9981L16.0059 13.9981"
                    stroke="#3498db"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <select
                  id="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                  required
                >
                  <option value="">Select Time</option>
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <div className="input-with-icon">
                <svg
                  className="input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 7V12L14.5 14.5"
                    stroke="#3498db"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#3498db"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <select
                  id="duration"
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_minutes: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Third Row - Service Search */}
          <div className="form-row search-row">
            <div className="form-group">
              <label htmlFor="service-search">Search Services</label>
              {hasDeletedServices && (
                <div className="warning-message">
                  ⚠️ Warning: Some services from this reservation have been
                  deleted. They have been automatically removed from the
                  selection.
                </div>
              )}
              <input
                id="service-search"
                type="text"
                placeholder="Search and add services..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="service-search"
              />
              {serviceSearch && (
                <div className="search-results">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="search-result-item"
                      onClick={() => addService(service)}
                    >
                      <span className="service-name">{service.name}</span>
                      <span className="service-price">${service.price}</span>
                      {service.color && (
                        <div
                          className="service-color-indicator"
                          style={{ backgroundColor: service.color }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Services List */}
          {selectedServices.length > 0 && (
            <div className="selected-services-section">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="selected-service-item"
                  style={{ backgroundColor: service.color + "30" || "#f3f4f6" }}
                >
                  <span className="service-name">{service.name}</span>
                  <span className="service-price">${service.price}</span>
                  <button
                    type="button"
                    className="remove-service-btn"
                    onClick={() => removeService(service.id)}
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="total-section">
                <span className="total-label">Total: ${calculateTotal()}</span>
              </div>
            </div>
          )}

          {selectedServices.length === 0 && (
            <div className="no-services-message">
              No services selected. Use the search bar above to add services.
            </div>
          )}

          <div className="modal-footer">
            {formData.id && (
              <Button
                type="button"
                onClick={handleDelete}
                className={`delete-btn ${showDeleteConfirm ? "confirm" : ""}`}
              >
                {showDeleteConfirm ? "Confirm Delete" : "Delete"}
              </Button>
            )}
            {showDeleteConfirm && (
              <Button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-btn"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={selectedServices.length === 0}
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
