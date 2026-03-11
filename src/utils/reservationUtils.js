/**
 * Utility functions for handling reservations with potentially deleted services
 */

/**
 * Filters out null/undefined services from a reservation's services array
 * @param {Array} services - Array of service objects that might contain null/undefined entries
 * @returns {Array} - Filtered array with only valid services
 */
export const filterValidServices = (services = []) => {
  return services.filter((service) => service && service.id);
};

/**
 * Checks if a reservation has any services that were deleted
 * @param {Array} originalServices - Original services array from reservation
 * @param {Array} validServices - Filtered valid services array
 * @returns {boolean} - True if some services were deleted
 */
export const hasDeletedServices = (
  originalServices = [],
  validServices = [],
) => {
  return originalServices.length > validServices.length;
};

/**
 * Gets valid service IDs from a reservation, filtering out deleted services
 * @param {Object} reservation - Reservation object with services array
 * @returns {Array} - Array of valid service IDs
 */
export const getValidServiceIds = (reservation) => {
  const validServices = filterValidServices(reservation.services);
  return validServices.map((service) => service.id);
};

/**
 * Validates and cleans service IDs array against available services
 * @param {Array} serviceIds - Array of service IDs to validate
 * @param {Array} availableServices - Array of currently available services
 * @returns {Object} - Object with validIds array and hasDeleted boolean
 */
export const validateServiceIds = (serviceIds = [], availableServices = []) => {
  const validIds = serviceIds.filter((id) =>
    availableServices.some((service) => service.id === id),
  );

  return {
    validIds,
    hasDeleted: serviceIds.length !== validIds.length,
  };
};

/**
 * Processes a reservation to ensure it has valid service references
 * @param {Object} reservation - Reservation object to process
 * @param {Array} availableServices - Array of currently available services
 * @returns {Object} - Processed reservation with clean service data
 */
export const processReservation = (reservation, availableServices = []) => {
  if (!reservation) return reservation;

  const validServices = filterValidServices(reservation.services);
  const validServiceIds = getValidServiceIds(reservation);

  return {
    ...reservation,
    services: validServices,
    service_ids: validServiceIds,
  };
};
