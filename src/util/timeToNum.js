export const timeToNum = (f) => {
  const [hh, mm] = f.split(':');
  const num = (hh * 3600 + mm * 60) * 1000;
  return num;
};