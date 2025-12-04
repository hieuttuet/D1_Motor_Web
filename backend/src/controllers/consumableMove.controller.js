import { getConsumableSpecById, updateConsumableInfo } from "../models/consumableMove.model.js";
import { getServerTime } from "../models/consumablePrint.model.js";
import { ok, error } from "../middlewares/responseHandler.js";
import { formatMySQLDate } from "../middlewares/formatDate.js";

export const getConsumableSpecByIdController = async (req, res) => {
    const { consumable_id } = req.params;
    try {
        const consumable = await getConsumableSpecById(consumable_id);
        if (!consumable) {
            return error(res, "Không tìm thấy nguyên vật liệu", 404);
        } else {
            return ok(res, consumable, "Lấy thông tin nguyên vật liệu thành công");
        }
    } catch (err) {
        return error(res, "Lỗi server", 500);
    }
};

export const updateConsumableInfoController = async (req, res) => {
    // Lấy thời gian server
        const serverTimeRow = await getServerTime();
        const serverTime = formatMySQLDate(serverTimeRow.server_time);
    const payload = {
        consumable_id : req.params.consumable_id,
        event_id: req.body.event_id,
        event_user: req.user.user_name,
        event_time: serverTime,
    };
    try {
        const result = await updateConsumableInfo(payload);
        return ok(res, {result : result}, "Di chuyển nguyên vật liệu thanh cong");
    } catch (err) {
        return error(res, "Lỗi server", 500);
    }
};