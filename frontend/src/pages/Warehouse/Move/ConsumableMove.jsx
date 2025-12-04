import React, { useState, useEffect } from "react";
import { formatDateTimeAMPM } from "../../../hooks/date.js";
import { showMessage } from "../../../components/Notification/messageService.jsx";
import "./consumableMove.css";
import {
  getConsumableSpecById,
  updateConsumableInfo,
} from "../../../api/warehouse/consumableMoveApi.js";
const options = [
  { value: "IWH", label: "IWH" },
  { value: "OWH", label: "OWH" },
  { value: "TER", label: "TER" },
];
export default function ConsumableMove() {
  const [consumableId, setConsumableId] = useState("");
  const [consumableInfo, setInfo] = useState(null);
  const [toLocation, setToLocation] = useState("");

  // 1️⃣ Lọc options theo event hiện tại
  const filteredOptions = React.useMemo(() => {
    if (!consumableInfo) return [];

    const current = consumableInfo.event_id;

    if (current === "IWH") {
      return options.filter((o) => o.value !== "IWH"); // OWH + TER
    }
    if (current === "OWH") {
      return options.filter((o) => o.value !== "OWH"); // IWH + TER
    }
    if (current === "TER") {
      return []; // không có lựa chọn
    }

    return [];
  }, [consumableInfo]);

  // 2️⃣ Khi filteredOptions thay đổi → set ToLocation mặc định
  useEffect(() => {
    if (filteredOptions.length > 0) {
      setToLocation(filteredOptions[0].value);
    } else {
      setToLocation("");
    }
  }, [filteredOptions]);
  useEffect(() => {
    document.title = "Consumable Move";
  }, []);
  // ======= Nhấn Enter để lấy thông tin =======
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (!consumableId.trim()) {
        await showMessage("⚠️ Vui lòng nhập mã nguyên vật liệu!", "warning");
        return;
      }
      await fetchConsumable();
    }
  };
  // xử lý input thay đổi để lọc danh sách
  const handleChangeCode = (value) => {
    setConsumableId(value);
  };

  // ======= Gọi API lấy thông tin nguyên vật liệu =======
  const fetchConsumable = async () => {
    try {
      const res = await getConsumableSpecById(consumableId.trim());
      if (res.data.success) {
        setInfo(res.data.info);
      } else {
        setInfo(null);
        await showMessage(res.data.message, "error");
      }
    } catch (err) {
      if (err.response) {
        showMessage(err.response.data.message, "error");
      } else {
        showMessage("Không thể kết nối server.", "error");
      }
    } finally {
      setConsumableId("");
    }
  };

  // ======= Gửi lệnh di chuyen consumable =======
  const handleMove = async () => {
    if (!consumableInfo)
      return showMessage(
        "⚠️ Vui lòng nhập thông tin nguyên vật liệu!",
        "warning"
      );
    try {
      const payload = {
        consumable_id: consumableInfo.consumable_id,
        event_id: toLocation,
      };
      const resConsumable = await updateConsumableInfo(payload);
      if (!resConsumable.data.success) {
        return showMessage(resConsumable.data.message, "error");
      }
      resetForm();
      await showMessage("Di chuyển nguyên vật liệu thành công!", "success");
    } catch (err) {
      if (err.response) {
        showMessage(err.response.data.message, "error");
      } else if (err.message) {
        showMessage(err.message, "error");
      } else {
        showMessage("Không thể kết nối server.", "error");
      }
    }
  };
  const resetForm = () => {
    setConsumableId("");
    setInfo(null);
    setToLocation("");
  };

  return (
    <div className="consumable-move-container">
      <h1>Consumable Move</h1>
      <div className="search-section">
        <h2>Search Info</h2>
        <div className="search-input-group">
          <label>Consumable ID *: </label>
          <input
            type="text"
            name="consumableId"
            value={consumableId}
            onChange={(e) => handleChangeCode(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      {/* Consumable Info Section - LUÔN HIỂN THỊ */}
      <div className="info-section">
        <div className="section-header">
          <h2>ConsumableInfo</h2>
        </div>
        <div className="basic-info-grid">
          <div className="info-row">
            <div className="info-pair">
              <label>Consumable ID:</label>
              <div className="info-value">
                {consumableInfo ? consumableInfo.consumable_id : "-"}
              </div>
            </div>
            <div className="info-pair">
              <label>Consumable Code:</label>
              <div className="info-value">
                {consumableInfo ? consumableInfo.consumable_code : "-"}
              </div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-pair">
              <label>Consumable Type:</label>
              <div className="info-value">
                {consumableInfo ? consumableInfo.consumable_type : "-"}
              </div>
            </div>
            <div className="info-pair">
              <label>Quantity:</label>
              <div className="info-value">
                {consumableInfo ? consumableInfo.quantity : "-"}
              </div>
            </div>
          </div>
          <div className="info-row">
            <div className="info-pair">
              <label>Event Time:</label>
              <div className="info-value">
                {consumableInfo
                  ? formatDateTimeAMPM(consumableInfo.event_time)
                  : "-"}
              </div>
            </div>
            <div className="info-pair">
              <label>Event User:</label>
              <div className="info-value">
                {consumableInfo ? consumableInfo.event_user : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="location-section">
        <div className="location-group">
          <label>From Location :</label>
          <div className="info-value">
            {consumableInfo ? consumableInfo.event_id : "-"}
          </div>
        </div>
        <div className="location-group">
          <label>To Location :</label>
          <select
            name="eventId"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            disabled={filteredOptions.length === 0}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            ) : (
              <option disabled>Không có lựa chọn</option>
            )}
          </select>
        </div>
      </div>

      <div className="button-section">
        <button onClick={handleMove} disabled={!consumableInfo || !toLocation}>
          MOVE
        </button>
      </div>
    </div>
  );
}
