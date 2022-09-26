export const formatMovementDate = function (date, location) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // Intl => ECMAScript Internationalization API
    return new Intl.DateTimeFormat(location).format(date);
  }
};

export const formatCurreny = function (value, location, currency) {
  // Intl => ECMAScript Internationalization API
  return new Intl.NumberFormat(location, {
    style: "currency",
    currency: currency,
  }).format(value);
};
