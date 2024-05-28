import { useState } from 'react';

export function useCalculateLeaveTime() {
  const [result, setResult] = useState('');

  const calculateLeaveTime = (departureTime, boardingTime, drivingTime) => {
    const totalMinutes = drivingTime;
    const boardingDate = new Date(`1970-01-01T${boardingTime}Z`);
    boardingDate.setMinutes(boardingDate.getMinutes() - totalMinutes);

    const hours = boardingDate.getUTCHours().toString().padStart(2, '0');
    const minutes = boardingDate.getUTCMinutes().toString().padStart(2, '0');

    setResult(`You should leave at: ${hours}:${minutes}`);
  };

  return { result, calculateLeaveTime };
}
