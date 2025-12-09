import React, { useState, useEffect, useRef, useCallback } from "react";
import { formatDateTimeAMPM } from "../../../Utils/date.js";
import { getConsumables } from "../../../api/admin/consumableApi.js";
import { saveAs } from "file-saver";
import "./consumableHistory.css";
// Giả định bạn đã import showMessage từ một file hợp lệ
import { showMessage } from "../../../components/Notification/messageService.jsx";
import {
  getConsumableHistory,
  downloadConsumableHistory,
} from "../../../api/warehouse/consumableHistoryApi.js";

export default function ConsumableHistory() {
  const [filters, setFilters] = useState({
    consumableCode: "",
    consumableId: "",
    eventId: "",
    startDate: "",
    endDate: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listCode, setListCode] = useState([]);
  const [filteredListCode, setFilteredListCode] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Mặc định là 1
  const [totalRecords, setTotalRecords] = useState(0); // Mặc định là 0
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.title = "Consumable History";
  }, []);

  // ==================== LOGIC LẤY DỮ LIỆU CHÍNH ====================
  // Sử dụng useCallback để hàm không bị tạo lại mỗi lần render
  const fetchData = useCallback(async (page, currentFilters) => {
    setLoading(true);

    try {
      // Gọi API với filters và tham số trang (page)
      const params = {
        ...currentFilters,
        page: page,
        pageSize: 10,
      };
      const res = await getConsumableHistory(params);

      if (res.data.success) {
        // Cập nhật danh sách và tổng số trang
        setHistoryList(res.data.info.list);

        // API PHẢI TRẢ VỀ totalPages (hoặc totalRecords để tính ra totalPages)
        setTotalPages(res.data.info.totalPages || 1);
        setTotalRecords(res.data.info.totalRecords || 0);
        setCurrentPage(page);
      } else {
        setHistoryList([]);
        setTotalPages(1);
        setTotalRecords(0);
        await showMessage(
          res.response.data.message || "Lỗi khi lấy dữ liệu lịch sử.",
          "error"
        );
      }
    } catch (err) {
      setHistoryList([]);
      setTotalPages(1);
      if (err.response) {
        showMessage(err.response.data.message, "error");
      } else {
        showMessage("Không thể kết nối server.", "error");
      }
    } finally {
      setLoading(false);
    }
  }, []);
  // ==============================================================================

  // ======= Lấy danh sách nguyên vật liệu =======
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getConsumables();
        if (res.data.success) {
          setListCode(res.data.info);
          setFilteredListCode(res.data.info);
        }
      } catch (err) {
        if (err.response) {
          showMessage(err.response.data.message, "error");
        } else {
          showMessage("Không thể kết nối server.", "error");
        }
      }
    };
    fetchList();
  }, []);

  // ======= Nhấn Enter để lấy thông tin =======
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (!filters.consumableCode.trim()) {
        await showMessage("⚠️ Vui lòng nhập mã nguyên vật liệu!", "warning");
        return;
      }
      setShowDropdown(false);
    }
  };

  // Xử lý input thay đổi để lọc danh sách
  const handleChangeCode = (value) => {
    setFilters((prev) => ({ ...prev, consumableCode: value }));
    setShowDropdown(true);

    const filtered = listCode.filter((item) =>
      item.consumable_code.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredListCode(filtered);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Khi chọn 1 mục từ dropdown
  const handleSelect = (item) => {
    setFilters((prev) => ({ ...prev, consumableCode: item.consumable_code }));
    setShowDropdown(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Hàm tìm kiếm ban đầu hoặc khi người dùng nhấn nút Search.
   * Luôn reset về trang 1.
   */
  const handleSearch = () => {
    // Gọi fetchData với trang 1 và filters hiện tại
    fetchData(1, filters);
  };

  /**
   * Xử lý khi người dùng chuyển trang.
   */
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || loading || downloading) return;

    // Chỉ cập nhật trang và gọi lại fetchData
    fetchData(page, filters);
  };

  // =========== HÀM TẢI XUỐNG EXCEL ===========
  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      // 1. Gọi API tải xuống, truyền các bộ lọc hiện tại
      const res = await downloadConsumableHistory(filters);

      // 2. Lấy tên file từ header (Tên file động từ Server)
      const contentDisposition = res.headers["content-disposition"];
      let fileName = "Consumable_History_Export.xlsx";

      if (contentDisposition) {
        // 1. Tìm phần chứa 'filename='
        const filenameSection = contentDisposition
          .split(";")
          .find((part) => part.trim().startsWith("filename="));

        if (filenameSection) {
          // 2. Lấy giá trị sau dấu '=' và loại bỏ dấu ngoặc kép
          fileName = filenameSection.split("=")[1].trim().replace(/['"]/g, "");
        }
      }
      // Tạo blob và lưu file
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // 3. Lưu Blob (dữ liệu file nhị phân) dưới dạng file
      saveAs(blob, fileName);
    } catch (err) {
      if (err.response) {
        showMessage(err.response.data.message || "Lỗi server", "error");
      } else {
        showMessage("Không thể kết nối server.", "error");
      }
    } finally {
      setDownloading(false);
    }
  };
  // =================================================

  const getTransactionClass = (type) => {
    switch (type) {
      case "IWH": // Input Warehouse
        return "type-in";
      case "OWH": // Output Warehouse
        return "type-out";
      case "TER": // Ter Warehouse
        return "type-ter";
      default:
        return "";
    }
  };

  return (
    <div className="history-lookup-container">
      <h1>Consumable History</h1>

      {/* 1. Bộ lọc */}
      <div className="filter-section">
        <div className="filter-grid">
          <div className="filter-item" ref={wrapperRef}>
            <label>Consumable Code:</label>
            <input
              type="text"
              value={filters.consumableCode}
              onChange={(e) => handleChangeCode(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Consumable Code Input ..."
            />
            {showDropdown && filteredListCode.length > 0 && (
              <div className="dropdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListCode.map((item, i) => (
                      <tr key={i} onClick={() => handleSelect(item)}>
                        <td>{item.consumable_code}</td>
                        <td>{item.consumable_type}</td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="filter-item">
            <label>Consumable ID:</label>
            <input
              type="text"
              name="consumableId"
              value={filters.consumableId}
              onChange={handleFilterChange}
              placeholder="Consumable ID Input ..."
            />
          </div>

          <div className="filter-item">
            <label>Status:</label>
            <select
              name="eventId"
              value={filters.eventId}
              onChange={handleFilterChange}
            >
              <option value="">ALL</option>
              <option value="IWH">IN (IWH)</option>
              <option value="OWH">OUT (OWH)</option>
            </select>
          </div>

          <div className="filter-item date-range">
            <label>Date Time:</label>
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
          <button
            onClick={handleSearch}
            disabled={loading || downloading}
            className="search-btn"
          >
            {loading ? "Searching..." : "🔍 Search"}
          </button>
        </div>
      </div>

      <hr />

      {/* 2. Bảng Lịch sử */}
      <div className="history-result-section">
        <div className="history-header-controls">
          <h2>Search Results ({totalRecords} rows)</h2>
          <button
            onClick={handleDownloadExcel}
            disabled={loading || downloading || historyList.length === 0}
            className="excel-btn"
          >
            {downloading ? "Downloading..." : "⬇️ Download Excel"}
          </button>
        </div>
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Consumable ID</th>
                <th>Consumable Code</th>
                <th>Type</th>
                <th>Expiration</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Event Time</th>
                <th>Event User</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="loading-row">
                    Searching...
                  </td>
                </tr>
              ) : historyList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data-row">
                    No history records found.
                  </td>
                </tr>
              ) : (
                historyList.map((item, index) => (
                  <tr key={item.id || index}>
                    <td data-label="Consumable Id">{item.consumable_id}</td>
                    <td data-label="Consumable Code" className="item-name-cell">
                      {item.consumable_code}
                    </td>
                    <td data-label="Type">{item.consumable_type}</td>
                    <td data-label="Expiration" className="date-cell">
                      {item.expiration}
                    </td>
                    <td data-label="Quantity" className="quantity-cell">
                      {item.quantity}
                    </td>
                    <td
                      data-label="Status"
                      className={`transaction-type ${getTransactionClass(
                        item.event_id
                      )}`}
                    >
                      {item.event_id}
                    </td>
                    <td data-label="Event Time" className="date-cell">
                      {formatDateTimeAMPM(item.event_time)}
                    </td>
                    <td data-label="Event User">{item.event_user}</td>
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
          disabled={currentPage <= 1 || loading || downloading}
        >
          &lt; Previous Page
        </button>
        <span>
          Page **{currentPage}** / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading || downloading}
        >
          Next Page &gt;
        </button>
      </div>
    </div>
  );
}
