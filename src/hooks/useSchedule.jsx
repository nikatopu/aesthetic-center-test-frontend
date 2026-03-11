import { useState, useCallback } from "react";
import { ReservationAPI } from "../api/client";

export const useSchedule = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ReservationAPI.getByDate(date);
      setReservations(res.data);
    } catch (err) {
      setError("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  }, []);

  const moveReservation = async (
    reservationId,
    newSpecialistId,
    newStartTime,
  ) => {
    try {
      // Simplification: In a full MVP, we'd send the full updated object
      await ReservationAPI.update(reservationId, {
        specialist_id: newSpecialistId,
        start_time: newStartTime,
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Move failed due to overlap",
      };
    }
  };

  return { reservations, fetchReservations, moveReservation, loading, error };
};
