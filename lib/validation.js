export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
}

export function validateHours(hours) {
  const hoursNum = parseFloat(hours);
  return !isNaN(hoursNum) && hoursNum > 0 && hoursNum <= 24;
}

export function validateAmount(amount) {
  const amountNum = parseFloat(amount);
  return !isNaN(amountNum) && amountNum > 0;
}

export function validateRequired(value) {
  return value !== null && value !== undefined && value !== '';
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

export const PRIORITIES = ['low', 'medium', 'high', 'critical'];
export const TASK_STATUSES = ['backlog', 'in_progress', 'in_review', 'completed'];
export const BUG_SEVERITIES = ['low', 'medium', 'high', 'critical'];
export const LEAVE_TYPES = ['vacation', 'sick', 'personal', 'other'];
export const APPROVAL_STATUSES = ['pending', 'approved', 'rejected'];
export const DELIVERY_PHASES = ['planning', 'development', 'testing', 'deployment', 'released'];

export function validatePriority(priority) {
  return PRIORITIES.includes(priority);
}

export function validateTaskStatus(status) {
  return TASK_STATUSES.includes(status);
}

export function validateApprovalStatus(status) {
  return APPROVAL_STATUSES.includes(status);
}