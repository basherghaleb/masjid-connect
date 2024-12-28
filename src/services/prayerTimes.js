const API_BASE_URL = 'http://api.aladhan.com/v1/timings';

export async function getPrayerTimes(latitude, longitude) {
  const response = await fetch(
    `${API_BASE_URL}/${Date.now() / 1000}?latitude=${latitude}&longitude=${longitude}&method=2`
  );
  const data = await response.json();
  return data.data.timings;
}

export function adjustPrayerTime(time, offsetMinutes) {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes) + parseInt(offsetMinutes));
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
} 