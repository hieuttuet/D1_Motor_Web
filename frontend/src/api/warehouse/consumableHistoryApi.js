import api from "../api";

// lay thong tin consumable history theo filter
export const getConsumableHistory = (params) => api.get(`/consumable-history/lookup`, {params});
export const downloadConsumableHistory = (params) => api.get(`/consumable-history/download`, {params});
  // Backend thường sử dụng GET request với query parameters cho các thao tác tìm kiếm/lấy danh sách.
  // Các tham số trong object 'params' (ví dụ: consumableCode, transactionType, startDate, page, pageSize)
  // sẽ tự động được Axios/API instance của bạn chuyển thành query string (?consumableCode=X&page=Y).

   
