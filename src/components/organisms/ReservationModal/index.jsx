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
    } else {
      setFormData(defaultData);
      setHasDeletedServices(false);
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

  // Calculate end time
  const getEndTime = (startTime, durationMinutes) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={formData.reservation_date}
                onChange={(e) =>
                  setFormData({ ...formData, reservation_date: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Start Time</label>
              <input
                id="time"
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specialist">Specialist</label>
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
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration</label>
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

          {formData.start_time && (
            <div className="time-range-display">
              <strong>Time Range:</strong> {formData.start_time} -{" "}
              {getEndTime(formData.start_time, formData.duration_minutes)}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="service-search">Services (Required)</label>
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
              placeholder="Search services..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              className="service-search"
            />
            <div className="services-list">
              {filteredServices.map((service) => (
                <label key={service.id} className="service-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.service_ids.includes(service.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          service_ids: [...formData.service_ids, service.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          service_ids: formData.service_ids.filter(
                            (id) => id !== service.id,
                          ),
                        });
                      }
                    }}
                  />
                  <span className="service-name">{service.name}</span>
                  {service.color && (
                    <div
                      className="service-color-indicator"
                      style={{ backgroundColor: service.color }}
                    />
                  )}
                </label>
              ))}
            </div>
            {formData.service_ids.length === 0 && (
              <div className="form-error">
                Please select at least one service
              </div>
            )}
          </div>

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
              disabled={
                !formData.service_ids || formData.service_ids.length === 0
              }
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
