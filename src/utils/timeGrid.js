export const TIME_SLOTS = [];
for (let hour = 8; hour <= 20; hour++) {
  TIME_SLOTS.push(`${hour.toString().padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${hour.toString().padStart(2, "0")}:30`);
}

const ROW_HEIGHT = 30; // 30px per 30 mins

export const calculatePosition = (startTime) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const startOffset = (hours - 8) * 60 + minutes; // minutes since 08:00
  return (startOffset / 30) * ROW_HEIGHT;
};

export const calculateHeight = (durationMinutes) => {
  return (durationMinutes / 30) * ROW_HEIGHT;
};
