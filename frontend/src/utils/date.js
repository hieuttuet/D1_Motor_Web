// src/utils/date.js
// Định dạng ngày giờ từ ISO sang định dạng dễ đọc hơn

// Ví dụ: "2023-10-05T14:48:00.000Z" => " 21:48:00 05/10/2023"
export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("vi-VN");
}

// Chỉ hiển thị ngày/tháng/năm : "05/10/2023"
export function formatDateOnly(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN"); 
}
// Định dạng ngày theo chuẩn ISO: "2023-10-05"
export function formatDateISO(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getDate().toString().padStart(2,"0")}`;
}
// Format: YYYY-MM-DD HH:MM:SS : "2023-10-05 14:48"
export function formatDateTime(iso) {
  if (!iso) return "";

  const d = new Date(iso);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}