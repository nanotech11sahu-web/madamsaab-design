const LABELS: Record<string, string> = {
  PENDING_WHATSAPP_CONFIRMATION: 'Pending Approval',
  CONFIRMED: 'Confirmed',
  ASSIGNED: 'Staff Assigned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

export function bookingStatusLabel(status: string): string {
  return LABELS[status] ?? status.replaceAll('_', ' ');
}
