import { useState, useEffect } from "react";
import { useGlobalContext } from "../../store/GlobalContext";
import { useToast } from "../../components/atoms/Toast/ToastProvider";
import { ReservationAPI } from "../../api/client";
import { processReservation } from "../../utils/reservationUtils";
import { TIME_SLOTS, calculateHeight } from "../../utils/timeGrid";
import { ReservationCard } from "../../components/organisms/ReservationCard";
import { ReservationModal } from "../../components/organisms/ReservationModal";
import { EmptyState } from "../../components/atoms/EmptyState";
import "./SchedulePage.css";

const SchedulePage = () => {
  const { specialists, services, selectedDate } = useGlobalContext();
  const { showSuccess, showError } = useToast();
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [draggingRes, setDraggingRes] = useState(null);
  const [ghostPos, setGhostPos] = useState(null);

  async function fetchReservations() {
    try {
      const res = await ReservationAPI.getByDate(selectedDate);
      // Process reservations to handle deleted services gracefully
      const processedReservations = res.data.map((reservation) =>
        processReservation(reservation, services),
      );
      setReservations(processedReservations);
    } catch (err) {
      showError(err.response?.data?.error || "Failed to load reservations");
    }
  }

  useEffect(() => {
    fetchReservations();
  }, [selectedDate]);

  async function handleSaveReservation(formData) {
    try {
      if (formData.id) {
        // Update existing reservation
        await ReservationAPI.update(formData.id, formData);
        showSuccess("Reservation updated successfully!");
      } else {
        // Create new reservation
        await ReservationAPI.create(formData);
        showSuccess("Reservation created successfully!");
      }

      // Refresh reservations and close modal
      await fetchReservations();
      setIsModalOpen(false);
      setModalData(null);
    } catch (err) {
      showError(err.response?.data?.error || "Failed to save reservation");
    }
  }

  const handleDeleteReservation = async (reservationId) => {
    try {
      await ReservationAPI.delete(reservationId);
      await fetchReservations();
      setIsModalOpen(false);
      setModalData(null);
      showSuccess("Reservation deleted successfully!");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to delete reservation");
    }
  };

  const handleGridClick = (spec, slot) => {
    setModalData({
      specialist_id: spec.id,
      start_time: slot,
      reservation_date: selectedDate,
      duration_minutes: 60,
      service_ids: [],
    });
    setIsModalOpen(true);
  };

  const handleDragOver = (e, specId) => {
    e.preventDefault();
    if (!draggingRes) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Snap to 30-minute intervals (30px per 30-min slot)
    const snappedY = Math.floor(y / 30) * 30;
    const timeSlotIndex = Math.floor(snappedY / 30);

    // Check if the time slot index is valid
    if (timeSlotIndex >= 0 && timeSlotIndex < TIME_SLOTS.length) {
      const newStartTime = TIME_SLOTS[timeSlotIndex];

      // Check for conflicts with existing reservations
      const hasConflict = reservations.some((res) => {
        if (res.id === draggingRes.id || res.specialist_id !== specId)
          return false;

        const resStart = new Date(`2000-01-01 ${res.start_time}`);
        const resEnd = new Date(
          resStart.getTime() + res.duration_minutes * 60000,
        );
        const dragStart = new Date(`2000-01-01 ${newStartTime}`);
        const dragEnd = new Date(
          dragStart.getTime() + draggingRes.duration_minutes * 60000,
        );

        return dragStart < resEnd && dragEnd > resStart;
      });

      setGhostPos({
        top: snappedY,
        specialistId: specId,
        hasConflict,
        newStartTime,
      });

      // Update cursor style based on conflict
      e.currentTarget.style.cursor = hasConflict ? "not-allowed" : "copy";
    }
  };

  const handleDrop = async () => {
    if (!draggingRes || !ghostPos || ghostPos.hasConflict) {
      // Reset position if conflict or invalid drop
      setDraggingRes(null);
      setGhostPos(null);
      return;
    }

    try {
      // Get fresh reservation data to ensure we have the latest information
      const currentReservation = reservations.find(
        (r) => r.id === draggingRes.id,
      );
      if (!currentReservation) {
        showError("Reservation not found!");
        setDraggingRes(null);
        setGhostPos(null);
        return;
      }

      // Filter out any null/undefined services before update
      const validServices = (currentReservation.services || []).filter(
        (service) => service && service.id,
      );
      const validServiceIds = validServices.map((s) => s.id);

      // Create the update payload with the new position and clean service data
      const updateData = {
        ...currentReservation,
        specialist_id: ghostPos.specialistId,
        start_time: ghostPos.newStartTime,
        reservation_date: selectedDate,
        service_ids: validServiceIds, // Use only valid service IDs
      };

      await ReservationAPI.update(draggingRes.id, updateData);
      await fetchReservations();
      showSuccess("Reservation moved successfully!");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to move reservation!");
    }

    setDraggingRes(null);
    setGhostPos(null);
  };

  if (!specialists?.length)
    return (
      <EmptyState
        message="No staff found."
        linkText="Add Staff"
        linkTo="staff"
      />
    );

  return (
    <div className="schedule-page">
      <div className="schedule-container">
        <div className="grid-scroll">
          <div className="grid-header">
            <div className="time-header-cell">
              <span>Time</span>
            </div>
            {specialists.map((s) => (
              <div key={s.id} className="header-cell">
                <img src={s.photo_url} alt="" />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
          <div className="grid-body">
            <div className="time-column">
              {TIME_SLOTS.map((slot) => (
                <div key={slot} className="time-slot-label">
                  {slot}
                </div>
              ))}
            </div>
            {specialists.map((spec) => (
              <div
                key={spec.id}
                className="spec-column"
                onDragOver={(e) => handleDragOver(e, spec.id)}
                onDrop={handleDrop}
              >
                {TIME_SLOTS.map((slot, i) => (
                  <div
                    key={slot}
                    className="grid-slot"
                    style={{ top: i * 30 }}
                    onClick={() => handleGridClick(spec, slot)}
                  />
                ))}
                {ghostPos?.specialistId === spec.id && (
                  <div
                    className={`ghost-preview ${ghostPos.hasConflict ? "conflict" : ""}`}
                    style={{
                      top: ghostPos.top,
                      height: calculateHeight(draggingRes.duration_minutes),
                    }}
                  />
                )}
                {reservations
                  .filter((r) => r.specialist_id === spec.id)
                  .map((res) => (
                    <div
                      key={res.id}
                      draggable
                      onDragStart={() => setDraggingRes(res)}
                      onClick={() => {
                        setModalData(res);
                        setIsModalOpen(true);
                      }}
                      className={draggingRes?.id === res.id ? "dragging" : ""}
                    >
                      <ReservationCard reservation={res} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalData}
        onSave={handleSaveReservation}
        onDelete={handleDeleteReservation}
      />
    </div>
  );
};
export default SchedulePage;
