function formatDateTime(date) {
  return date.toDateString().substr(4, 11);
}

export {formatDateTime};