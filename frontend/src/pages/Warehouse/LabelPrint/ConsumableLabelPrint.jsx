import React, { useState,useEffect,useRef } from "react";
import { getConsumableSpecByCode, updateConsumableInfo, updateZPLPosition, getZPLPosition } from "../../../api/warehouse/consumablePrintApi.js";
import { showMessage } from "../../../components/Notification/messageService.jsx";
import "./consumableLabelPrint.css";
import { setupWebPrint, sendZplCode } from "../../../hooks/zebraPrinter.js";
import {getConsumables} from "../../../api/admin/consumableApi.js"; 

export default function ConsumableLabelPrint() {
  const [code, setCode] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [listConsumable, setListConsumable] = useState([]); 
  const [filteredList, setFilteredList] = useState([]);
  const [position, setPosition] = useState({ X: "", Y: "" });
  const [consumableInfo, setInfo] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [isPrinterConnected, setPrinterName] = useState("disconnect"); 
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.title = "Consumable Label Print";
  }, []);
  //load tọa độ in ZPL khi component mount
  useEffect(() => {
    const fetchZPLPosition = async () => {  
      try {
        const res = await getZPLPosition("consumable");
        if (res.data.success) {
          setPosition({ 
            X: res.data.info.position_x, 
            Y: res.data.info.position_y 
          });
        } else {
          showMessage(res.data.message, "error");
        }
      } catch (err) {
        if (err.response) {
        showMessage(err.response.data.message ,"error");
        } else {
        showMessage("Không thể kết nối server.", "error");
        }
      }
    };
    fetchZPLPosition();
  }, []);
  // ======= Lấy danh sách nguyên vật liệu =======
  useEffect(() => {
  const fetchList = async () => {
    try {
      const res = await getConsumables();  // API bạn có thể tạo
      if (res.data.success) {
        setListConsumable(res.data.info);
        setFilteredList(res.data.info);
      }
    } catch (err) {
      if (err.response) {
      showMessage(err.response.data.message ,"error");
      } else {
      showMessage("Không thể kết nối server.", "error");
      }
    }
  };
  fetchList();
}, []);
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
  // ======= Nhấn Enter để lấy thông tin =======
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (!code.trim()) {
        await showMessage("⚠️ Vui lòng nhập mã nguyên vật liệu!", "warning");
        return;
      }
      await fetchConsumable();
    }
  };
  // xử lý input thay đổi để lọc danh sách
  const handleChangeCode = (value) => {
  setCode(value);
  setShowDropdown(true);

  const filtered = listConsumable.filter(item =>
    item.consumable_code.toLowerCase().includes(value.toLowerCase())
  );

  setFilteredList(filtered);
};
//khi chọn 1 mục từ dropdown
const handleSelect = (item) => {
  setCode(item.consumable_code);
  setShowDropdown(false);
  setInfo(item);
};

  // ======= Gọi API lấy thông tin nguyên vật liệu =======
  const fetchConsumable = async () => {
    try {
      const res = await getConsumableSpecByCode(code.trim());
      if (res.data.success) {
        setInfo(res.data.info);
      } else {
        setInfo(null);
        await showMessage(res.data.message, "error");
      }
    } catch (err) {
      if (err.response) {
      showMessage(err.response.data.message ,"error");
      } else {
      showMessage("Không thể kết nối server.", "error");
      }
    } finally {
      setCode("");
    }
  };

  // ======= Gửi lệnh in ZPL =======
  const handlePrint = async () => {
    if (!consumableInfo) return showMessage("⚠️ Vui lòng nhập mã hợp lệ trước khi in!", "warning");
    if (!quantity || quantity <= 0) return showMessage("⚠️ Vui lòng nhập số lượng hợp lệ!", "warning");

    // Kết nối máy in Zebra khi print
    setupWebPrint((connected) => {
      setPrinterName(connected ? "connected" : "disconnect");
    });
    if(isPrinterConnected === "disconnect") {
      return showMessage("❌ Chưa kết nối máy in!", "error");
    }
    try {
      const payload = {
        label_id : "consumable",
        consumable_spec_id: consumableInfo.consumable_spec_id,
        consumable_code: consumableInfo.consumable_code,
        consumable_type: consumableInfo.consumable_type,
        description: consumableInfo.description,
        expiration: consumableInfo.expiration,
        quantity: Number(quantity),
      };
      const resConsumable = await updateConsumableInfo(payload);
      if (!resConsumable.data.success) {
        return showMessage(resConsumable.data.message, "error");
      }
      const zplCode = resConsumable.data.info.zplCode;
      const successPrint = sendZplCode(zplCode); // gửi đến máy in
      if (!successPrint)
        return showMessage("❌In label thất bại\nVui lòng kiểm tra máy in!", "error") // in thất bại;
      resetForm();
      await showMessage("🖨 In label thành công!", "success");
    } catch (err) {
      if (err.response) {
      showMessage(err.response.data.message ,"error");
      } else if (err.message) {
      showMessage(err.message, "error");
      } else {
      showMessage("Không thể kết nối server.", "error");
      }
    };
  };
  // ====== TEST PRINT ======
const handleTestPrint = async () => {
  if (!position.X || !position.Y) {
    return showMessage("⚠️ Vui lòng nhập tọa độ hợp lệ!", "warning");
  }

  // Kết nối máy in
  setupWebPrint((connected) => {
    setPrinterName(connected ? "connected" : "disconnect");
  });

  if (isPrinterConnected === "disconnect") {
    return showMessage("❌ Chưa kết nối máy in!", "error");
  }

  try {
    const payload = {
      label_id: "consumable",
      position_x: Number(position.X),
      position_y: Number(position.Y)
    };

    const res = await updateZPLPosition(payload);
    if (!res.data.success) {
      return showMessage(res.data.message, "error");
    }

    const zplCode = res.data.info.zplCode;
    const successPrint = sendZplCode(zplCode);

    if (!successPrint) {
      return showMessage("❌ In label thất bại!", "error");
    }

    await showMessage("🖨 Test Print thành công!", "success");
  } catch (err) {
    if (err.response) {
      showMessage(err.response.data.message, "error");
    } else {
      showMessage(err.message || "Không thể kết nối server", "error");
    }
  }
};
  const resetForm = () => {
      setCode("");
      setInfo(null);
      setQuantity("");
  };

  return (
    <div className="label-print-container">
      <h1>Consumable Label Print</h1>
      <div className="positions-section">
        <div className="position-grid">
          <div className="position-row">
            <label> Location X :</label>
            <input type="number" 
            value={position.X} 
            onChange={(e) =>
            setPosition({ ...position, X: e.target.value })}/>
        </div>
          <div className="position-row">
              <label> Location Y :</label>
              <input type="number" 
              value={position.Y} 
              onChange={(e) =>
              setPosition({ ...position, Y: e.target.value })}/> 
          </div>
        </div>
        <div className="test-print-section">
          <button onClick={handleTestPrint} disabled={!position.Y || !position.X}>
            Test Print
          </button>
        </div>
      </div>
      <div className="search-section">
        <h2>Search Info</h2>
        <div className="search-input-group">
          <label>Consumable ID *: </label>
          <div ref={wrapperRef} style={{ position: "relative" }}>
            <input
              type="text"
              value={code}
              onChange={(e) => handleChangeCode(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
            />
            {showDropdown && filteredList.length > 0 && (
              <div className="dropdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((item, i) => (
                      <tr key={i} onClick={() => handleSelect(item)}>
                        <td>{item.consumable_code}</td>
                        <td>{item.consumable_type}</td>
                        <td>{item.description}</td>
                        <td>{item.expiration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
              <label>Consumable Code:</label>
              <div className="info-value">{consumableInfo ? consumableInfo.consumable_code : "-"}</div>
            </div>
            <div className="info-pair">
              <label>Consumable Type:</label>
              <div className="info-value">{consumableInfo ? consumableInfo.consumable_type : "-"}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-pair">
              <label>Description:</label>
              <div className="info-value">{consumableInfo ? consumableInfo.description: "-"}</div>
            </div>
            <div className="info-pair">
              <label>Expiration:</label>
              <div className="info-value">{consumableInfo ? consumableInfo.expiration : "-"}</div>
            </div>
          </div>
</div>

      </div>

      <div className="quantity-section">
          <label>Quantity :</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
          />
      </div>

      <div className="button-section">
        <button onClick={handlePrint} disabled={!consumableInfo || !quantity}>
          🖨 PRINT
        </button>
      </div>
    </div>
  );
}
