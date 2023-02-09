import DateAndTime from 'date-and-time';

const startHourUTC = 8;
const endHourUTC = 17;

const isWeekend = (date?: Date) => {
  const dateToCheck = date || new Date();

  return dateToCheck.getUTCDay() === 6 || dateToCheck.getUTCDay() === 0;
};

const isOutsideWorkingHours = (date?: Date) => {
  const dateToCheck = date || new Date();

  return dateToCheck.getUTCHours() < startHourUTC || dateToCheck.getUTCHours() >= endHourUTC;
};

const getInsideWorkingHoursDateInMs = (dateInMs: number) => {
  const dateToCheck = new Date(dateInMs);
  if (!isOutsideWorkingHours(dateToCheck)) return dateInMs;

  if (dateToCheck.getUTCDay() < startHourUTC) {
    return new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate()).setUTCHours(startHourUTC);
  }
  if (dateToCheck.getUTCDay() < 20) {
    return new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate()).setUTCHours(endHourUTC);
  }

  return new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate() + 1).setUTCHours(startHourUTC);
};

const getNextAvailableHelperDateInMs = (dateInMs?: number, matchedOnWeekends = false) => {
  const dateToCheck = dateInMs ? new Date(dateInMs) : new Date();

  if (isOutsideWorkingHours(dateToCheck)) {
    dateToCheck.setUTCHours(startHourUTC);
    dateToCheck.setMinutes(0);
    if (dateToCheck < new Date()) {
      dateToCheck.setDate(dateToCheck.getDate() + 1);
    }
  }

  if (isWeekend(dateToCheck) && !matchedOnWeekends) {
    dateToCheck.setDate(dateToCheck.getDate() + (!dateToCheck.getDay() ? 1 : 2));
  }

  return dateToCheck.getTime();
};

const getDaysLeft = (initialDate: Date, maxDurationActionInDays: number) => {
  if (!maxDurationActionInDays) return 0;

  const creationDate = new Date(initialDate);
  const endDate = DateAndTime.addDays(creationDate, maxDurationActionInDays);

  const daysLeft = Math.round(DateAndTime.subtract(endDate, new Date()).toDays());

  return daysLeft < 0 ? 0 : daysLeft;
};

export {
  isWeekend,
  isOutsideWorkingHours,
  getNextAvailableHelperDateInMs,
  getDaysLeft,
  getInsideWorkingHoursDateInMs,
};
