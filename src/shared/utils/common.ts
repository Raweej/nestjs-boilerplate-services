export async function convertTimestamp(timestamp: number) {
  // Create a new Date object based on the timestamp
  const date = new Date(timestamp * 1000);

  // Get the individual components of the date
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  // Construct the date and time string
  const dateTimeString =
    day +
    '/' +
    month +
    '/' +
    year +
    ' ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds;

  return dateTimeString;
}
