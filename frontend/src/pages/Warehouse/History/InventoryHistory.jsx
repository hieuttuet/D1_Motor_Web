import React, { useState, useEffect } from "react";
import "./inventoryHistory.css";
// Import các API cần thiết tại đây (ví dụ: searchHistoryApi, getWarehousesApi)
// import { searchHistory } from "../../../api/warehouse/inventoryApi.js"; 
// import { showMessage } from "../../../components/Notification/messageService.jsx";

// Dữ liệu giả định để hiển thị
const mockHistoryData = [
  { id: 1, item_code: "RM-001A", item_name: "Tấm thép SS400", warehouse_code: "WH-A", transaction_type: "IN", quantity: 500, unit: "KG", date: "2024-11-20 10:30:00", user: "Kho A" },
  { id: 2, item_code: "PC-102B", item_name: "CPU Core i5", warehouse_code: "WH-B", transaction_type: "OUT", quantity: 10, unit: "PCS", date: "2024-11-20 14:45:00", user: "Sản xuất B" },
  { id: 3, item_code: "RM-001A", item_name: "Tấm thép SS400", warehouse_code: "WH-A", transaction_type: "ADJUST", quantity: -5, unit: "KG", date: "2024-11-21 08:00:00", user: "Kiểm kê" },
  { id: 4, item_code: "PC-102B", item_name: "CPU Core i5", warehouse_code: "WH-B", transaction_type: "IN", quantity: 20, unit: "PCS", date: "2024-11-21 11:15:00", user: "Kho B" },
  { id: 5, item_code: "GL-330X", item_name: "Dung môi làm sạch", warehouse_code: "WH-C", transaction_type: "OUT", quantity: 5, unit: "LIT", date: "2024-11-21 16:20:00", user: "QC" },
];

export default function InventoryHistory() {
  const [filters, setFilters] = useState({
    itemCode: "",
    warehouseCode: "",
    startDate: "",
    endDate: "",
    transactionType: "",
  });
  const [historyList, setHistoryList] = useState(mockHistoryData);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Giả định

  useEffect(() => {
    document.title = "Tra Cứu Lịch Sử Kho";
    // Tải danh sách kho/loại giao dịch nếu cần
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setCurrentPage(1); // Reset trang khi tìm kiếm mới
    // Thực tế sẽ gọi API tại đây
    // try {
    //   const res = await searchHistory(filters);
    //   if (res.data.success) {
    //     setHistoryList(res.data.info.list);
    //     setTotalPages(res.data.info.totalPages);
    //   } else {
    //     showMessage(res.data.message, "error");
    //   }
    // } catch (err) {
    //   showMessage("Không thể kết nối server.", "error");
    // } finally {
    //   setLoading(false);
    // }
    
    // Giả lập tìm kiếm thành công
    setTimeout(() => {
        console.log("Searching with filters:", filters);
        setHistoryList(mockHistoryData.filter(item => 
            item.item_code.includes(filters.itemCode) &&
            (filters.transactionType === "" || item.transaction_type === filters.transactionType)
        ));
        setLoading(false);
    }, 500);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Thực hiện gọi API tìm kiếm với tham số page mới
  };
  
  const getTransactionClass = (type) => {
    switch (type) {
      case "IN": return "type-in";
      case "OUT": return "type-out";
      case "ADJUST": return "type-adjust";
      default: return "";
    }
  };

  return (
    <div className="history-lookup-container">
      <h1>Tra Cứu Lịch Sử Kho</h1>
      
      {/* 1. Bộ lọc */}
      <div className="filter-section">
        <h2>Bộ Lọc Tra Cứu</h2>
        <div className="filter-grid">
          
          <div className="filter-item">
            <label>Mã Vật Tư:</label>
            <input
              type="text"
              name="itemCode"
              value={filters.itemCode}
              onChange={handleFilterChange}
              placeholder="Nhập mã vật tư..."
            />
          </div>

          <div className="filter-item">
            <label>Kho:</label>
            <select
              name="warehouseCode"
              value={filters.warehouseCode}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              <option value="WH-A">WH-A (Nguyên liệu)</option>
              <option value="WH-B">WH-B (Thành phẩm)</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Loại Giao Dịch:</label>
            <select
              name="transactionType"
              value={filters.transactionType}
              onChange={handleFilterChange}
            >
              <option value="">Tất cả</option>
              <option value="IN">Nhập Kho (IN)</option>
              <option value="OUT">Xuất Kho (OUT)</option>
              <option value="ADJUST">Điều Chỉnh</option>
            </select>
          </div>
          
          <div className="filter-item date-range">
            <label>Thời Gian:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <span> - </span>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="filter-actions">
          <button onClick={handleSearch} disabled={loading}>
            {loading ? "Đang tìm..." : "🔍 Tìm Kiếm"}
          </button>
        </div>
      </div>
      
      <hr />

      {/* 2. Bảng Lịch sử */}
      <div className="history-result-section">
        <h2>Kết Quả Lịch Sử ({historyList.length} giao dịch)</h2>
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Mã Vật Tư</th>
                <th>Tên Vật Tư</th>
                <th>Kho</th>
                <th>Loại GD</th>
                <th>Số Lượng</th>
                <th>ĐVT</th>
                <th>Thời Gian</th>
                <th>Người Thực Hiện</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="loading-row">Đang tải dữ liệu...</td></tr>
              ) : historyList.length === 0 ? (
                <tr><td colSpan="8" className="no-data-row">Không tìm thấy giao dịch nào.</td></tr>
              ) : (
                historyList.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Mã Vật Tư">{item.item_code}</td>
                    <td data-label="Tên Vật Tư" className="item-name-cell">{item.item_name}</td>
                    <td data-label="Kho">{item.warehouse_code}</td>
                    <td data-label="Loại GD" className={`transaction-type ${getTransactionClass(item.transaction_type)}`}>
                        {item.transaction_type}
                    </td>
                    <td data-label="Số Lượng" className="quantity-cell">{item.quantity > 0 ? `+${item.quantity}` : item.quantity}</td>
                    <td data-label="ĐVT">{item.unit}</td>
                    <td data-label="Thời Gian" className="date-cell">{item.date}</td>
                    <td data-label="Người Thực Hiện">{item.user}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Phân trang */}
      <div className="pagination-section">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1 || loading}
        >
          &lt; Trang Trước
        </button>
        <span>Trang **{currentPage}** / {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages || loading}
        >
          Trang Sau &gt;
        </button>
      </div>
    </div>
  );
}