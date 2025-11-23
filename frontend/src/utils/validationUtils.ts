export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  return { isValid: true };
};

export const validateTaskTitle = (title: string): { isValid: boolean; message?: string } => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, message: 'Title is required' };
  }
  if (title.length > 100) {
    return { isValid: false, message: 'Title must be less than 100 characters' };
  }
  return { isValid: true };
};

export const validateTaskTime = (startTime: string, endTime: string): { isValid: boolean; message?: string } => {
  if (!startTime || !endTime) {
    return { isValid: false, message: 'Start time and end time are required' };
  }
  if (endTime <= startTime) {
    return { isValid: false, message: 'End time must be after start time' };
  }
  return { isValid: true };
};

export const validateDescription = (description: string): { isValid: boolean; message?: string } => {
  if (description && description.length > 500) {
    return { isValid: false, message: 'Description must be less than 500 characters' };
  }
  return { isValid: true };
};
