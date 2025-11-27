import { ok, error } from "../middlewares/responseHandler.js";
import ExcelJS from "exceljs";
import { getConsumableHistoryWithPagination, downloadConsumableHistoryModel } from "../models/consumableHistory.model.js";
// Lấy thông tin lịch sử vật tư tiêu hao với phân trang và lọc
export const getConsumableHistoryController = async (req, res) => {
  try {
    const { consumableCode, consumableId, eventId, fromDate, toDate, page, pageSize} = req.query;
    const filters = {
      consumableCode,
        consumableId,
        eventId,
        fromDate,
        toDate,
    };
    const historyList = await getConsumableHistoryWithPagination(filters, page, pageSize);
    return ok(res, historyList, "Lấy lịch sử vật tư tiêu hao thành cong");
  } catch (err) {
    console.error("Lỗi lấy lịch sử vật tư tiêu hao:", err);
    return error(res, "Lỗi server", 500);
  }
};
// Download toàn bộ lịch sử vật tư tiêu hao dưới dạng file excel
export const downloadConsumableHistoryController = async (req, res) => {
  try {
    const { consumableCode, consumableId, eventId, fromDate, toDate } = req.query;
    const filters = {
      consumableCode,
        consumableId,
        eventId,
        fromDate,
        toDate,
    };
    // 1. Gọi Model để LẤY DỮ LIỆU THÔ
        const rows = await downloadConsumableHistoryModel(filters);
        if (!rows || rows.length === 0) {
            // Có thể trả về 200 OK với file rỗng, hoặc trả về lỗi 404/400 nếu không có data
            return error(res, "Không có dữ liệu phù hợp để xuất Excel.", 400); 
        }
        // 2. TẠO FILE EXCEL
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Consumable History");
        
        // Định nghĩa cột
        worksheet.columns = [
            { header: "Consumable ID", key: "consumable_id", width: 15 },
            { header: "Code", key: "consumable_code", width: 15 },
            { header: "Type", key: "consumable_type", width: 10 },
            { header: "Quantity", key: "quantity", width: 10 },
            { header: "Event ID", key: "event_id", width: 10 },
            { header: "Event Time", key: "event_time", width: 25 },
            { header: "User", key: "event_user", width: 15 },
        ];
        
        // Thêm dữ liệu
        worksheet.addRows(rows); 
        
        // Ghi Workbook vào Buffer
        const excelBuffer = await workbook.xlsx.writeBuffer();

        // 3. THIẾT LẬP HTTP HEADERS và GỬI RESPONSE
        const fileName = `Consumable_History_${Date.now()}.xlsx`;
        
        res.setHeader(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition', 
            `attachment; filename=${fileName}`
        );
        console.log(excelBuffer);
        return res.send(excelBuffer); // Gửi Buffer về Frontend
  } catch (err) {
    console.error("Lỗi download lịch sử NVL:", err);
    return error(res, "Lỗi server", 500);
  }
};
