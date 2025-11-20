// middlewares/responseHandler.js

// Trả về thành công
export const ok = (res, info = null, message = "Thành công") => {
  return res.status(200).json({
    success: true,
    message,
    info,
  });
};

// Trả về lỗi
export const error = (res, message = "Lỗi không xác định", status = 400, errorCode = "ERROR") => {
  return res.status(status).json({
    success: false,
    message,
    error_code: errorCode,
  });
};
