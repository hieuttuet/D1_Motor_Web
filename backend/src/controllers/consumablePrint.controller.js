import {getConsumableSpecByCode } from "../models/consumableSpecs.model.js";
import { getServerTime, getSequenceConsumableCode, insertConsumableWithHistory, getZPLCodeModel, updateZPLPositionModel, getZPLPositionModel } from "../models/consumablePrint.model.js";
import { ok, error } from "../middlewares/responseHandler.js";
// lấy tọa độ in ZPL
export const getZPLPositionController = async (req, res) => {
  const { label_id } = req.params;
  try {
    const position = await getZPLPositionModel(label_id);
    if (!position) {
      return error(res, "Không tìm thấy tọa độ in ZPL", 404);
    } else {
      return ok(res, position, "Lấy tọa độ in ZPL thành công");
    }
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
}
// 🔹 Lấy thông tin consumable theo id
export const getConsumableByCodeController = async (req, res) => {
  const { consumable_code } = req.params;
  try {
    const consumable = await getConsumableSpecByCode(consumable_code);
    if (!consumable) {
      return error(res, "Không tìm thấy nguyên vật liệu", 404);
    } else {
      return ok(res, consumable, "Lấy thông tin nguyên vật liệu thành công");
    }
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};
// 🔹 Cập nhật thông tin consumable và in ZPL
export const updateConsumableAndPrintZPLController = async (req, res) => {
  try {
    const {user_name} = req.user;
    const { consumable_code } = req.params;
    const consumableData = req.body;
    // Lấy thời gian server
    const serverTimeRow = await getServerTime();
    const serverTime = serverTimeRow.server_time;
    const yyyy = serverTime.getFullYear();
    const mm = String(serverTime.getMonth() + 1).padStart(2, "0");
    const dd = String(serverTime.getDate()).padStart(2, "0");

    const formatted = `${yyyy}${mm}${dd}`;

    // Lấy sequence trong ngày
    const sequenceRow = await getSequenceConsumableCode(consumable_code);
    let sequenceInDay = sequenceRow?.max_seq ? sequenceRow.max_seq + 1 : 1;
    // Convert số thành chuỗi 3 ký tự, thêm '0' ở đầu
    const seq3 = sequenceInDay.toString().padStart(3, '0');
    // Convert quantity số thành chuỗi 5 ký tự, thêm '0' ở đầu
    const qty5 = consumableData.quantity.toString().padStart(5, '0');
    // Tạo consumable id
    const consumable_id = `${consumable_code}_${formatted}_${seq3}_${qty5}`;
    // Lấy ZPL code từ database
    const zplRecord = await getZPLCodeModel(consumableData.label_id);//lay thong tin zpl code
    if (!zplRecord) {
      return error(res, "Không tìm thấy lệnh in ZPL", 404);
    }
    const zplCodeTemplate = zplRecord.zpl_code;
    let zplData = zplCodeTemplate
      .replace("{{POSITION_X}}", zplRecord.position_x)
      .replace("{{POSITION_Y}}", zplRecord.position_x)
      .replace("{{CONSUMABLE_ID}}", consumable_id)
      .replace("{{CONSUMABLE_CODE}}", consumableData.consumable_code)
      .replace("{{TYPE}}", consumableData.consumable_type)
      .replace("{{EXP}}", consumableData.expiration)
      .replace("{{QTY}}", consumableData.quantity)
      .replace("{{DATE}}", serverTime.toISOString().split('T')[0]);

    // Chuẩn bị dữ liệu để insert
    const consumableToInsert = {
      consumable_spec_id: consumableData.consumable_spec_id,
      consumable_id: consumable_id,
      consumable_code: consumableData.consumable_code,
      consumable_type: consumableData.consumable_type,
      expiration: consumableData.expiration,
      quantity: consumableData.quantity,
      event_id: "IWH",
      sequence: sequenceInDay,
      zpl_data: zplData,
      event_time: serverTime,
      event_user: user_name,   
      
    };
    // Insert consumable và lịch sử
    const insertResult = await insertConsumableWithHistory(consumableToInsert);
    return ok(res, { zplCode : zplData, insertResult: insertResult} ,"Cập nhật thông tin nguyên vật liệu và in ZPL thành công");
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};
// 🔹 Cập nhật tọa độ in ZPL  
export const updateZPLLabelPositionController = async (req, res) => {
  try {
    const { label_id } = req.params;  
    const { position_x, position_y } = req.body;
    const updateResult = await updateZPLPositionModel(label_id, position_x, position_y);
    // lấy lệnh in zpl mới sau khi cập nhật
    const zplRecord = await getZPLCodeModel(label_id);//lay thong tin zpl code
    if (!zplRecord) {
      return error(res, "Không tìm thấy lệnh in ZPL", 404); 
    }
    const zplCodeTemplate = zplRecord.zpl_code;
    let zplData = zplCodeTemplate
      .replace("{{POSITION_X}}", position_x)
      .replace("{{POSITION_Y}}", position_y)
      .replace("{{CONSUMABLE_ID}}", "TEST")
      .replace("{{CONSUMABLE_CODE}}", "TEST")
      .replace("{{TYPE}}", "TEST")
      .replace("{{EXP}}", "TEST")
      .replace("{{QTY}}", "TEST")
      .replace("{{DATE}}", "TEST");
    return ok(res, { zplCode : zplData, updateResult: updateResult} ,"Cập nhật tọa độ in ZPL thành công");
  } catch (err) {
    return error(res, "Lỗi server", 500);
  }
};