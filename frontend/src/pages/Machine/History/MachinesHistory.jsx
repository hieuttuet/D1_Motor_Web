import React, { useState, useEffect } from "react";
// Giả định API để tải danh sách, chi tiết lịch sử và download file
import { showMessage } from "../../../components/Notification/messageService.jsx";
import "./machinesHistory.css";

// --- DỮ LIỆU MẪU (Thay thế bằng API thật) ---
const MOCK_LIST = [
  {
    id: 1,
    assetCode: "A001",
    serialNumber: "SNX-101",
    machineName: "Máy Phay CNC 5 Trục",
    model: "MC-5AX-2025",
    currentStatus: "Đang Hoạt Động",
    imageUrls: [
        "https://via.placeholder.com/100/198754/FFFFFF?text=A001_1",
        "https://via.placeholder.com/100/54A819/FFFFFF?text=A001_2",
        "https://via.placeholder.com/100/19A854/FFFFFF?text=A001_3",
        "https://via.placeholder.com/100/5419A8/FFFFFF?text=A001_4"
    ],
  },
  {
    id: 2,
    assetCode: "B002",
    serialNumber: "SNY-202",
    machineName: "Máy Cắt Laser Công Nghiệp",
    model: "LCR-1000",
    currentStatus: "Đang Sửa Chữa",
    imageUrls: [
        "https://via.placeholder.com/100/ffc107/333333?text=B002_1",
        "https://via.placeholder.com/100/Ff7B07/333333?text=B002_2",
    ],
  },
  {
    id: 3,
    assetCode: "C003",
    serialNumber: "SNZ-303",
    machineName: "Máy Ép Thủy Lực",
    model: "HP-300T",
    currentStatus: "Mới",
    imageUrls: ["https://via.placeholder.com/100/0dcaf0/FFFFFF?text=C003_1"],
  },
  {
    id: 4,
    assetCode: "D004",
    serialNumber: "SNT-404",
    machineName: "Máy Phay CNC 3 Trục",
    model: "MC-3AX-2023",
    currentStatus: "Đang Hoạt Động",
    imageUrls: ["https://via.placeholder.com/100/198754/FFFFFF?text=D004_1"],
  },
];

const LARGE_MOCK_HISTORY = Array.from({ length: 55 }, (_, i) => ({
    id: i + 100,
    date: `2025-${String(Math.floor(i / 10) + 1).padStart(2, '0')}-${String((i % 10) + 1).padStart(2, '0')}`,
    type: (i % 3 === 0) ? "Bảo Trì" : (i % 3 === 1) ? "Sửa Chữa" : "Kiểm Tra",
    description: `Bản ghi hoạt động số ${i + 1}: Thay đổi tham số vận hành.`,
    status: (i % 2 === 0) ? "Đang Hoạt Động" : "Đã qua sử dụng",
    personnel: `Kỹ thuật viên ${i % 5}`,
}));

const HISTORY_PAGE_SIZE = 10;

// Hàm hiển thị trạng thái bằng badge
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


export default function MachinesHistory() {
  const [machineList, setMachineList] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  // States cho việc lọc và tìm kiếm
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // States phân trang lịch sử chi tiết
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingSummary, setDownloadingSummary] = useState(false);
  const [downloadingDetail, setDownloadingDetail] = useState(false);


  useEffect(() => {
    document.title = "Machine History List";
    loadMachineList();
  }, []);

  // --- HÀM TẢI DANH SÁCH MÁY (Kèm Lọc) ---
  const loadMachineList = async (e) => {
    if (e) e.preventDefault();

    setLoadingList(true);
    setSelectedMachine(null);
    setHistoryData(null);
    setError(null);

    const filters = {
        name: searchName,
        status: filterStatus,
    };

    try {
      // ⚠️ API THẬT: const res = await fetchMachineList(filters);

      // GIẢ LẬP LỌC TRÊN DỮ LIỆU MẪU
      const filteredList = MOCK_LIST.filter(machine => {
        const matchesName = searchName
          ? machine.machineName.toLowerCase().includes(searchName.toLowerCase()) ||
            machine.model.toLowerCase().includes(searchName.toLowerCase())
          : true;
        const matchesStatus = filterStatus
          ? machine.currentStatus === filterStatus
          : true;
        return matchesName && matchesStatus;
      });

      setMachineList(filteredList);
      if (filteredList.length === 0 && (searchName || filterStatus)) {
           showMessage("Không tìm thấy máy móc nào phù hợp với điều kiện lọc.", "info");
      }

    } catch (err) {
      setError("Lỗi khi tải danh sách máy móc.");
      showMessage("Lỗi hệ thống.", "error");
    } finally {
      setLoadingList(false);
    }
  };

  // --- HÀM XỬ LÝ CHỌN MÁY VÀ TẢI LỊCH SỬ ---
  const handleSelectMachine = async (machine) => {
    if (selectedMachine && selectedMachine.id === machine.id) {
        setSelectedMachine(null);
        setHistoryData(null);
        setHistoryCurrentPage(1);
        return;
    }

    setSelectedMachine(machine);
    setLoadingHistory(true);
    setHistoryData(null);
    setError(null);
    setHistoryCurrentPage(1);

    try {
      // ⚠️ API THẬT: Tải lịch sử cho machine.id
      setHistoryData(LARGE_MOCK_HISTORY);
    } catch (err) {
      setError(`Không thể tải lịch sử cho máy ${machine.assetCode}.`);
      showMessage("Lỗi tải lịch sử.", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchName') {
        setSearchName(value);
    } else if (name === 'filterStatus') {
        setFilterStatus(value);
    }
  };

  const handlePageChange = (newPage) => {
    setHistoryCurrentPage(newPage);
  };

  // --- HÀM XỬ LÝ DOWNLOAD EXCEL CHI TIẾT (Từng Máy) ---
  const handleDownloadDetailExcel = async (machineId, assetCode) => {
    setDownloadingDetail(true);
    try {
      // ⚠️ API THẬT: Gọi API download chi tiết
      // const res = await downloadMachineHistoryExcel(machineId);

      const mockData = `Lịch sử chi tiết máy ${assetCode} (55 bản ghi).`;
      const res = { data: new Blob([mockData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) };

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;

      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.setAttribute('download', `LichSu_${assetCode}_${date}.xlsx`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showMessage("Tải xuống file Excel chi tiết thành công!", "success");

    } catch (error) {
      console.error("Lỗi khi tải xuống Excel chi tiết:", error);
      showMessage("Lỗi khi tải xuống file Excel. Vui lòng thử lại.", "error");
    } finally {
      setDownloadingDetail(false);
    }
  };

  // --- HÀM XỬ LÝ DOWNLOAD BÁO CÁO TỔNG HỢP ---
  const handleDownloadSummaryExcel = async () => {
    setDownloadingSummary(true);
    try {
      // ⚠️ API THẬT: Gọi API download tổng hợp (gửi kèm bộ lọc)
      // const res = await downloadMachineSummaryExcel({ searchName, filterStatus });

      const mockData = `Báo cáo tổng hợp của ${machineList.length} máy đã lọc.`;
      const res = { data: new Blob([mockData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) };

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;

      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.setAttribute('download', `BaoCaoTongHop_${date}.xlsx`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showMessage("Tải xuống báo cáo tổng hợp thành công!", "success");

    } catch (error) {
      console.error("Lỗi khi tải xuống Báo cáo Tổng hợp:", error);
      showMessage("Lỗi khi tải xuống báo cáo. Vui lòng thử lại.", "error");
    } finally {
      setDownloadingSummary(false);
    }
  };


  // --- JSX cho Khu vực Lịch sử Chi tiết (CỘT PHẢI) ---
  const HistoryDetail = () => {
      if (!selectedMachine) {
          return (
              <div className="history-detail-placeholder">
                  <p>⬅️ Vui lòng chọn một máy ở danh sách bên trái để xem lịch sử chi tiết.</p>
              </div>
          );
      }

      const machine = selectedMachine;

      // Logic phân trang nội bộ
      const totalRecords = historyData ? historyData.length : 0;
      const totalPages = Math.ceil(totalRecords / HISTORY_PAGE_SIZE);
      const startIndex = (historyCurrentPage - 1) * HISTORY_PAGE_SIZE;
      const endIndex = startIndex + HISTORY_PAGE_SIZE;
      const currentHistoryPage = historyData ? historyData.slice(startIndex, endIndex) : [];


      return (
          <div className="history-detail-content">
              <h3>Lịch Sử Máy: {machine.machineName}</h3>

              {/* --- KHU VỰC HIỂN THỊ ẢNH (GALLERY) --- */}
              {machine.imageUrls && machine.imageUrls.length > 0 && (
                  <div className="machine-image-gallery">
                      {machine.imageUrls.map((url, index) => (
                          <img
                              key={index}
                              src={url}
                              alt={`${machine.assetCode} - Ảnh ${index + 1}`}
                              className="detail-gallery-image"
                          />
                      ))}
                  </div>
              )}

              <div className="detail-header-controls">
                <div className="detail-summary-grid">
                    <p><strong>Mã Tài Sản:</strong> {machine.assetCode}</p>
                    <p><strong>Model:</strong> {machine.model}</p>
                    <p><strong>Serial:</strong> {machine.serialNumber}</p>
                    <p>
                        <strong>Trạng Thái Hiện Tại:</strong>{" "}
                        {renderStatusBadge(machine.currentStatus)}
                    </p>
                </div>

                {/* NÚT DOWNLOAD CHI TIẾT */}
                <button
                    className="download-excel-button"
                    onClick={() => handleDownloadDetailExcel(machine.id, machine.assetCode)}
                    disabled={downloadingDetail || loadingHistory || !historyData || historyData.length === 0}
                >
                    {downloadingDetail ? 'Đang Tạo File...' : 'Tải xuống Excel'}
                </button>
              </div>

              <hr />

              {loadingHistory ? (
                  <div className="loading-state history-loading">Đang tải lịch sử chi tiết...</div>
              ) : (
                  historyData && historyData.length > 0 ? (
                      <div className="history-table-wrapper">
                         <h4>Hoạt Động Gần Nhất (Tổng: {totalRecords} bản ghi)</h4>
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
                              {currentHistoryPage.map((item) => (
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

                          {/* --- NÚT PHÂN TRANG --- */}
                          {totalPages > 1 && (
                              <div className="pagination-controls">
                                  <button
                                      onClick={() => handlePageChange(historyCurrentPage - 1)}
                                      disabled={historyCurrentPage === 1}
                                  >
                                      &laquo; Trang Trước
                                  </button>
                                  <span>Trang {historyCurrentPage} / {totalPages}</span>
                                  <button
                                      onClick={() => handlePageChange(historyCurrentPage + 1)}
                                      disabled={historyCurrentPage === totalPages}
                                  >
                                      Trang Sau &raquo;
                                  </button>
                              </div>
                          )}

                      </div>
                  ) : (
                      <p className="no-history-data">Máy này chưa có lịch sử hoạt động chi tiết.</p>
                  )
              )}
          </div>
      );
  };

  return (
    <div className="history-container">
      {/* Header và Bộ lọc nằm trên cùng */}
      <div className="history-search-card">
        <h2>Tra Cứu Lịch Sử Máy Móc ⚙️</h2>
        <p className="subtitle">Chọn máy bên trái để xem lịch sử chi tiết bên phải.</p>

        {/* KHU VỰC LỌC/TÌM KIẾM */}
        <form onSubmit={loadMachineList} className="filter-form">
          {/* Lọc theo Tên máy */}
          <div className="filter-group">
            <label htmlFor="searchName">Tên/Model:</label>
            <input
              type="text"
              id="searchName"
              name="searchName"
              placeholder="Tìm theo tên hoặc Model máy..."
              value={searchName}
              onChange={handleFilterChange}
            />
          </div>

          {/* Lọc theo Trạng thái */}
          <div className="filter-group">
            <label htmlFor="filterStatus">Trạng thái:</label>
            <select
              id="filterStatus"
              name="filterStatus"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="">-- Tất cả Trạng thái --</option>
              <option value="Mới">Mới</option>
              <option value="Đang Hoạt Động">Đang Hoạt Động</option>
              <option value="Đang Sửa Chữa">Đang Sửa Chữa</option>
              <option value="Đã qua sử dụng">Đã qua sử dụng</option>
            </select>
          </div>

          <button type="submit" disabled={loadingList} className="filter-button">
            {loadingList ? "Đang Tải..." : "Áp Dụng Lọc"}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* --- KHU VỰC CHIA CỘT SIDE-BY-SIDE --- */}
      <div className="side-by-side-layout">

        {/* CỘT TRÁI: DANH SÁCH MÁY */}
        <div className="machine-list-panel">
            <div className="list-panel-header">
                <h4>Danh sách Máy Móc ({machineList.length} máy)</h4>
                {/* NÚT DOWNLOAD TỔNG HỢP */}
                <button
                    className="download-summary-button"
                    onClick={handleDownloadSummaryExcel}
                    disabled={loadingList || downloadingSummary || machineList.length === 0}
                    title="Tải xuống thông tin tóm tắt của tất cả các máy đã được lọc."
                >
                    {downloadingSummary ? 'Đang Tạo File...' : 'Tải Báo cáo Tổng hợp'}
                </button>
            </div>

            {loadingList ? (
                <div className="loading-state">Đang tải danh sách...</div>
            ) : machineList.length === 0 ? (
                <div className="no-history-data">Không tìm thấy máy móc nào.</div>
            ) : (
                <div className="machine-list-wrapper">
                    {machineList.map((machine) => (
                        <div
                            key={machine.id}
                            className={`machine-list-item ${selectedMachine && selectedMachine.id === machine.id ? 'active' : ''}`}
                            onClick={() => handleSelectMachine(machine)}
                        >
                            <div className="machine-image-col">
                                <img
                                    src={machine.imageUrls[0] || "placeholder-default-url"}
                                    alt={machine.assetCode}
                                    className="machine-thumbnail"
                                />
                            </div>

                            <div className="machine-info-col">
                                <h5>{machine.machineName}</h5>
                                <p>Mã: <strong>{machine.assetCode}</strong></p>
                                {renderStatusBadge(machine.currentStatus)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* CỘT PHẢI: CHI TIẾT LỊCH SỬ */}
        <div className="history-detail-panel">
            <HistoryDetail />
        </div>

      </div>
    </div>
  );
}