import React from "react";
import { calculatePosition, calculateHeight } from "../../../utils/timeGrid";
import {
  filterValidServices,
  hasDeletedServices,
} from "../../../utils/reservationUtils";
import "./ReservationCard.css";

export const ReservationCard = ({ reservation }) => {
  // Filter out any services that might be null/undefined due to deletion
  const validServices = filterValidServices(reservation.services);
  const mainService = validServices[0];
  const additionalServices = validServices.slice(1) || [];
  const hasDeleted = hasDeletedServices(reservation.services, validServices);

  // Calculate end time
  const getEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;
  };

  const style = {
    top: `${calculatePosition(reservation.start_time)}px`,
    height: `${calculateHeight(reservation.duration_minutes)}px`,
    backgroundColor: mainService?.color + "30" || "#3b82f6",
    color: mainService?.color || "#fff",
    borderLeft: `2px solid`,
  };

  return (
    <div className="reservation-card" style={style}>
      <div className="res-content">
        <div className="main-service">
          {mainService?.name || "[Deleted Service]"}
          {hasDeleted && (
            <span
              className="deleted-service-warning"
              title="Some services have been deleted"
            >
              ⚠️
            </span>
          )}
        </div>
        {additionalServices.length > 0 && (
          <ul className="extra-services">
            {additionalServices.map((s) => (
              <li key={s.id}>• {s.name}.</li>
            ))}
          </ul>
        )}
        {hasDeleted && validServices.length === 0 && (
          <div className="deleted-services-notice">All services deleted</div>
        )}
        <div className="res-footer">
          <div className="time-range">
            {reservation.start_time.slice(0, 5)} -{" "}
            {getEndTime(reservation.start_time, reservation.duration_minutes)}
          </div>
          <div className="specialist-name">
            {reservation.specialist_name} {reservation.specialist_surname.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};
