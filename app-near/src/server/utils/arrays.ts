export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunked = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunked.push(chunk);
  }
  return chunked;
};
