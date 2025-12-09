import db from "../config/db.js";
import { addOneDay } from "../middlewares/formatDate.js";

//lấy thông tin lịch sử vật tư tiêu hao với phân trang và lọc
export const getConsumableHistoryWithPagination = async (
  filters,
  page,
  pageSize
) => {
  // lấy totalRecords
  let countQuery = "SELECT COUNT(*) AS total FROM consumable_history WHERE 1=1";
  const offset = (page - 1) * pageSize;
  let baseQuery = "SELECT * FROM consumable_history WHERE 1=1";
  const queryParams = [];
  // Thêm điều kiện lọc vào truy vấn
  if (filters.consumableCode) {
    countQuery += " AND consumable_code = ?";
    baseQuery += " AND consumable_code = ?";
    queryParams.push(filters.consumableCode);
  }
  if (filters.consumableId) {
    countQuery += " AND consumable_id = ?";
    baseQuery += " AND consumable_id = ?";
    queryParams.push(filters.consumableId);
  }
  if (filters.eventId) {
    countQuery += " AND event_id = ?";
    baseQuery += " AND event_id = ?";
    queryParams.push(filters.eventId);
  }
  if (filters.startDate) {
    countQuery += " AND event_time >= ?";
    baseQuery += " AND event_time >= ?";
    queryParams.push(filters.startDate);
  }
  if (filters.endDate) {
    countQuery += " AND event_time <= ?";
    baseQuery += " AND event_time <= ?";
    queryParams.push(addOneDay(filters.endDate));
  }
  baseQuery += " ORDER BY event_time DESC LIMIT ? OFFSET ?";
  // Trả về kết quả
  const countResult = await db.query(countQuery, queryParams);
  console.log("query", baseQuery);
  const totalRecords = countResult[0].total;
  //Chuyển kết quả sang Number nếu DB trả về là BigInt
  const totalRecordsNumber =
    typeof totalRecords === "bigint" ? Number(totalRecords) : totalRecords;
  const totalPages = Math.ceil(totalRecordsNumber / Number(pageSize));
  queryParams.push(Number(pageSize), Number(offset));
  const rows = await db.query(baseQuery, queryParams);
  console.log(countQuery, queryParams);

  return {
    list: rows,
    totalPages: totalPages,
    totalRecords: totalRecordsNumber,
  };
};
//downlaod toàn bộ lịch sử vật tư tiêu hao dưới dạng file excel
export const downloadConsumableHistoryModel = async (filters) => {
  let baseQuery = "SELECT * FROM consumable_history WHERE 1=1";
  const queryParams = [];
  // Thêm điều kiện lọc vào truy vấn
  if (filters.consumableCode) {
    baseQuery += " AND consumable_code = ?";
    queryParams.push(filters.consumableCode);
  }
  if (filters.consumableId) {
    baseQuery += " AND consumable_id = ?";
    queryParams.push(filters.consumableId);
  }
  if (filters.eventId) {
    baseQuery += " AND event_id = ?";
    queryParams.push(filters.eventId);
  }
  if (filters.startDate) {
    baseQuery += " AND event_time >= ?";
    queryParams.push(filters.startDate);
  }
  if (filters.endDate) {
    baseQuery += " AND event_time <= ?";
    queryParams.push(addOneDay(filters.endDate));
  }
  baseQuery += " ORDER BY event_time DESC";
  const rows = await db.query(baseQuery, queryParams);
  return rows;
};
