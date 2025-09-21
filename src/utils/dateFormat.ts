import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function getRelativeTime(date: Date | string): string {
  return dayjs(date).fromNow();
}

export function formatDate(date: Date | string): string {
  return dayjs(date).format('MMM D, YYYY h:mm A');
}
