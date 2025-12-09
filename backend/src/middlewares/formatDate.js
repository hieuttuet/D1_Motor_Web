export const formatMySQLDate = (date) => {
  const pad = (n) => (n < 10 ? "0" + n : n);

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

// Hàm cộng thêm 1 ngày
export const addOneDay = (dateStr) =>{
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 19).replace("T", " ");
}