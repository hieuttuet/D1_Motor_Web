import {addMachineInput} from "../models/machinesInput.model.js";
import {ok, error} from "../middlewares/responseHandler.js";

// controllers/machinesInput.controller.js
export const addMachinesInputController = async (req, res) => {
    try {
        const data = req.body;
        const response = await addMachineInput(data, req.files);
        return ok(res, response, "Thành công");
    } catch (err) {
        return error(res, "Lỗi server", 500);
    }
};