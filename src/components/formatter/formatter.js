import { format } from 'date-fns';

export const formatDate = (date) => format(date, 'iii MMM dd yyyy');
export const formatDateTime = (date) => format(date, 'iii MMM dd yyyy HH:mm');
export const formatTime = (date) => format(date, 'HH:mm');