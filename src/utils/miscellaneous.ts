function formatDateTime(date: Date): string {
  return date.toDateString().substr(4, 11);
}

export { formatDateTime };
