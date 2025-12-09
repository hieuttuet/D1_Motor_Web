import React, { useState, useEffect } from "react";
import { showMessage } from "../../../components/Notification/messageService.jsx";
import "./machinesHistory.css";

// Dữ liệu mẫu cho lịch sử (thay thế bằng API thật)
const MOCK_HISTORY = [
  {
    id: 1,
    date: "2025-10-01",
    type: "Nhập Kho",
    description: "Nhập kho ban đầu, trạng thái Mới.",
    status: "Mới",
    personnel: "Nguyễn Văn A",
  },
  {
    id: 2,
    date: "2025-11-15",
    type: "Bảo Trì Định Kỳ",
    description: "Bảo dưỡng dầu máy và kiểm tra bộ lọc.",
    status: "Đang Hoạt Động",
    personnel: "Lê Văn B",
  },
  {
    id: 3,
    date: "2025-12-05",
    type: "Sửa Chữa",
    description: "Thay thế trục quay bị mòn sau 1000 giờ hoạt động.",
    status: "Đang Sửa Chữa",
    personnel: "Trần Thị C",
  },
  {
    id: 4,
    date: "2025-12-08",
    type: "Hoàn Thành Sửa Chữa",
    description: "Sửa chữa hoàn tất, máy trở lại hoạt động bình thường.",
    status: "Đang Hoạt Động",
    personnel: "Nguyễn Văn A",
  },
];

export default function MachinesHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [historyData, setHistoryData] = useState(null);
  const [machineInfo, setMachineInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Machine History";
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return showMessage("Vui lòng nhập Mã tài sản hoặc Số Serial.", "warning");
    }

    setLoading(true);
    setHistoryData(null);
    setMachineInfo(null);
    setError(null);

    try {
      // ⚠️ GỌI API THẬT: Thay thế bằng fetchMachineHistory(searchTerm);
      // Giả lập kết quả API:
      const res = {
        success: true,
        machine: {
          assetCode: searchTerm.toUpperCase(),
          machineName: "Máy Phay CNC 5 Trục",
          model: "MC-5AX-2025",
          currentStatus: "Đang Hoạt Động",
          lastUpdate: "2025-12-08",
        },
        history: MOCK_HISTORY,
      };

      if (!res.success || !res.machine) {
        setError(`Không tìm thấy máy móc nào với mã: ${searchTerm}`);
        showMessage("Không tìm thấy máy.", "error");
        return;
      }

      setMachineInfo(res.machine);
      setHistoryData(res.history);
    } catch (err) {
      setError("Lỗi khi kết nối đến máy chủ.");
      showMessage("Lỗi hệ thống.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Hàm hiển thị trạng thái bằng badge (theo màu sắc)
  const renderStatusBadge = (status) => {
    let className = "status-badge ";
    switch (status) {
      case "Mới":
        className += "status-new";
        break;
      case "Đang Hoạt Động":
        className += "status-active";
        break;
      case "Đang Sửa Chữa":
        className += "status-repair";
        break;
      default:
        className += "status-default";
    }
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="history-container">
      <div className="history-search-card">
        <h2>Tra Cứu Lịch Sử Máy Móc ⚙️</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Nhập Mã tài sản (Asset Code) hoặc Số Serial"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang Tra Cứu..." : "Tìm Kiếm"}
          </button>
        </form>
      </div>

      {/* Hiển thị lỗi */}
      {error && <div className="error-message">{error}</div>}

      {/* Khu vực hiển thị thông tin máy */}
      {machineInfo && (
        <div className="history-results-area">
          <h3>Thông Tin Máy: {machineInfo.machineName}</h3>
          <div className="machine-summary-grid">
            <p><strong>Mã Tài Sản:</strong> {machineInfo.assetCode}</p>
            <p><strong>Model:</strong> {machineInfo.model}</p>
            <p>
              <strong>Trạng Thái Hiện Tại:</strong>{" "}
              {renderStatusBadge(machineInfo.currentStatus)}
            </p>
            <p><strong>Cập Nhật Cuối:</strong> {machineInfo.lastUpdate}</p>
          </div>

          <hr />

          {/* Bảng Lịch Sử */}
          {historyData && historyData.length > 0 ? (
            <div className="history-table-wrapper">
              <h4>Lịch Sử Hoạt Động ({historyData.length} bản ghi)</h4>
              <table>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Loại Hoạt Động</th>
                    <th>Mô Tả</th>
                    <th>Trạng Thái Sau</th>
                    <th>Nhân sự</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item) => (
                    <tr key={item.id}>
                      <td data-label="Ngày">{item.date}</td>
                      <td data-label="Loại">{item.type}</td>
                      <td data-label="Mô Tả" className="description-cell">{item.description}</td>
                      <td data-label="Trạng Thái">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td data-label="Nhân sự">{item.personnel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-history-data">Không có lịch sử hoạt động nào được ghi nhận.</p>
          )}
        </div>
      )}
    </div>
  );
}