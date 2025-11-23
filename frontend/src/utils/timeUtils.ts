export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 330; // 5.5 hours = 330 minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = (utcMinutes + istOffset) % (24 * 60);
  const hours = Math.floor(istMinutes / 60);
  const minutes = istMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${Math.round(minutes).toString().padStart(2, '0')}`;
};

export const getCurrentMinutesSinceMidnight = (): number => {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 330; // 5.5 hours = 330 minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = (utcMinutes + istOffset) % (24 * 60);
  
  console.log('Debug getCurrentMinutesSinceMidnight:', {
    utcHours: now.getUTCHours(),
    utcMinutes: now.getUTCMinutes(),
    utcTotal: utcMinutes,
    istMinutes: istMinutes,
    istTime: `${Math.floor(istMinutes / 60)}:${Math.round(istMinutes % 60)}`
  });
  
  return istMinutes;
};

export const isTimeInRange = (currentTime: string, startTime: string, endTime: string): boolean => {
  return currentTime >= startTime && currentTime < endTime;
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
};

export const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  const totalMinutes = timeToMinutes(time) + minutesToAdd;
  return minutesToTime(totalMinutes % (24 * 60));
};
