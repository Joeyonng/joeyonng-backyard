function formatDateTime(date) {
  return date.toDateString().substr(0, 11) + date.toLocaleTimeString("en-US");
}

export {formatDateTime};