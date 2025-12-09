import React, { useState, useEffect } from "react";
import { createMachineInput } from "../../../api/machine/machinesInputApi.js";
import { fetchCurrentDate } from "../../../api/utilityApi.js";
import { showMessage } from "../../../components/Notification/messageService.jsx";
import "./machinesInput.css";

// Hằng số giới hạn
const MAX_FILES = 4;
const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 1MB = 1,048,576 bytes
const INITIAL_STATE = {
  machineName: "",
  serialNumber: "",
  invoice: "",
  deliveryDate: "",
  model: "",
  assetCode: "",
  machineStatus: "OK",
  description: "",
  image: [],
};

export default function MachinesInputs() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  // State mới để lưu Data URL và tên tệp cho mục đích xem trước (preview)
  const [imagePreviews, setImagePreviews] = useState([]);
  const [serverMaxDate, setServerMaxDate] = useState("");

  useEffect(() => {
    document.title = "Machine Input";
    // GỌI API ĐỂ LẤY NGÀY TRÊN SERVER
    const loadMaxDate = async () => {
      try {
        const res = await fetchCurrentDate();
        if (res.data.success) {
          // Lưu YYYY-MM-DD vào state
          setServerMaxDate(res.data.currentDate);
        }
      } catch (error) {
        console.error("Lỗi lấy ngày server:", error);
        // Fallback: Nếu lỗi, dùng ngày client và cảnh báo.
        const today = new Date().toISOString().split('T')[0];
        setServerMaxDate(today);
      }
    };
    loadMaxDate();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const selectedFiles = Array.from(files);
      let filesToSave = [];
      let oversizedFilesCount = 0;

      // 1. Lọc và kiểm tra dung lượng từng tệp
      for (const file of selectedFiles) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          oversizedFilesCount++;
        } else {
          filesToSave.push(file);
        }
      }

      // 2. Thông báo nếu có file quá lớn
      if (oversizedFilesCount > 0) {
        showMessage(
          `Đã loại bỏ ${oversizedFilesCount} tệp. Mỗi tệp ảnh chỉ được có dung lượng tối đa là ${MAX_FILE_SIZE_MB}MB.`,
          "error"
        );
      }

      // 3. Kiểm tra giới hạn số lượng (sau khi đã lọc dung lượng)
      if (filesToSave.length > MAX_FILES) {
        showMessage(`Bạn chỉ được chọn tối đa ${MAX_FILES} ảnh.`, "error");
        filesToSave = filesToSave.slice(0, MAX_FILES);
      }

      // 4. Lưu mảng tệp đã được giới hạn vào state
      setFormData({ ...formData, image: filesToSave });

      // 5. TẠO VÀ LƯU URL XEM TRƯỚC (Data URL)
      if (filesToSave.length > 0) {
        const previewPromises = filesToSave.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                name: file.name,
                url: e.target.result, // Data URL
              });
            };
            reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
          });
        });

        // Chờ tất cả FileReader hoàn tất và cập nhật state preview
        Promise.all(previewPromises).then((previews) => {
          setImagePreviews(previews);
        });
      } else {
        setImagePreviews([]);
      }

      // Quan trọng: Reset giá trị của input file để cho phép người dùng chọn lại cùng một tệp nếu muốn.
      e.target.value = null;
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  // HÀM XỬ LÝ VIỆC XÓA ẢNH
  const handleRemoveImage = (indexToRemove) => {
    // 1. Cập nhật mảng File object trong formData (Dữ liệu gửi lên server)
    const newFilesArray = formData.image.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData({ ...formData, image: newFilesArray });

    // 2. Cập nhật mảng Previews (Dữ liệu hiển thị)
    const newPreviewsArray = imagePreviews.filter(
      (_, index) => index !== indexToRemove
    );
    setImagePreviews(newPreviewsArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 1. Tạo đối tượng FormData
    const dataToSend = new FormData();

    // 2. Đính kèm tất cả các trường dữ liệu (không phải file)
    dataToSend.append("machineName", formData.machineName);
    dataToSend.append("serialNumber", formData.serialNumber);
    dataToSend.append("invoice", formData.invoice);
    dataToSend.append("deliveryDate", formData.deliveryDate);
    dataToSend.append("model", formData.model);
    dataToSend.append("assetCode", formData.assetCode);
    dataToSend.append("machineStatus", formData.machineStatus);
    dataToSend.append("description", formData.description);

    // 3. Đính kèm File Object (Chú ý: phải lặp qua mảng file)
    if (formData.image && formData.image.length > 0) {
      // Vì formData.image là MẢNG các File, ta cần lặp và append từng file
      // API backend thường nhận mảng file với cùng một key (ví dụ: 'image[]' hoặc chỉ 'image')
      // Dùng cùng key 'image' sẽ gửi mảng file lên backend.
      formData.image.forEach((file) => {
        dataToSend.append("image", file);
      });
    }
    // 4. Gọi API
    setLoading(true);
    try {
      const res = await createMachineInput(dataToSend);
      if (!res.data.success) {
        return showMessage(res.data.message, "error");
      }

      console.log("Thông tin nhập kho:", formData);
      await showMessage("Input thông tin máy thành công!", "success");
      // Reset form và tên file hiển thị
      setFormData(INITIAL_STATE);
      setImagePreviews([]); // Reset preview
    } catch (error) {
      showMessage(error.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };
  // Hàm hiển thị danh sách ảnh đã chọn (Previews)
  const renderImagePreviews = () => {
    if (imagePreviews.length === 0) {
      return (
        <p className="no-file-selected">
          <span className="icon-label">💡</span> Chưa có tệp nào được chọn. Tối
          đa **{MAX_FILES}** ảnh, mỗi ảnh **{MAX_FILE_SIZE_MB}MB**.
        </p>
      );
    }

    return (
      <div className="image-previews-container">
        <div className="previews-grid">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="preview-item">
              {/* NÚT XÓA ẢNH */}
              <span
                className="remove-image-btn"
                onClick={() => handleRemoveImage(index)}
                title={`Xóa ảnh ${preview.name}`}
              >
                &times;
              </span>

              <img
                src={preview.url}
                alt={`Ảnh đã chọn ${index + 1}`}
                className="preview-image"
              />
              <p className="image-name">{preview.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tên file hiển thị
  const fileNameDisplay =
    imagePreviews.length > 0
      ? `${imagePreviews.length} tệp đã chọn`
      : "No file chosen";

  return (
    <div className="equipment-entry-container">
      <div className="form-card">
        {/* Header */}
        <div className="form-header">
          <h2>Nhập Máy Móc Thiết Bị Mới</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Grid Layout cho các trường thông tin cơ bản */}
          <div className="form-grid">
            {/* Tên Máy */}
            <div className="form-group">
              <label htmlFor="machineName">
                <span className="icon-label">⚙️</span> Tên Máy{" "}
                <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="machineName"
                name="machineName"
                value={formData.machineName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Số Serial */}
            <div className="form-group">
              <label htmlFor="serialNumber">
                <span className="icon-label">🗂️</span> Số Serial (Serial Number){" "}
                <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Model */}
            <div className="form-group">
              <label htmlFor="model">
                <span className="icon-label">🧾</span> Model Name
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
            {/* Số Hoá Đơn */}
            <div className="form-group">
              <label htmlFor="invoice">
                <span className="icon-label">🧾</span> Số Hoá Đơn (Invoice)
              </label>
              <input
                type="text"
                id="invoice"
                name="invoice"
                value={formData.invoice}
                onChange={handleChange}
              />
            </div>

            {/* Asset Code*/}
            <div className="form-group">
              <label htmlFor="assetCode">
                <span className="icon-label">🔢</span> Asset Code{" "}
                <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="assetCode"
                name="assetCode"
                min="1"
                value={formData.assetCode}
                onChange={handleChange}
                required
              />
            </div>

            {/* Trạng Thái Máy */}
            <div className="form-group">
              <label htmlFor="machineStatus">
                <span className="icon-label">✅</span> Trạng Thái Máy{" "}
                <span className="required-star">*</span>
              </label>
              <select
                id="machineStatus"
                name="machineStatus"
                value={formData.machineStatus}
                onChange={handleChange}
                required
              >
                <option value="OK">OK</option>
                <option value="NG">NG</option>
              </select>
            </div>
          </div>

          {/* Thời Gian Về */}
          <div className="form-group">
            <label htmlFor="deliveryDate">
              <span className="icon-label">🗓️</span> Thời Gian Về{" "}
              <span className="required-star">*</span>
            </label>
            <div className="date-input-wrapper">
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                placeholder="yyyy/mm/dd"
                max={serverMaxDate}
                value={formData.deliveryDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Mô Tả Chi Tiết (Full width) */}
          <div className="form-group full-width">
            <label htmlFor="description">
              <span className="icon-label">📝</span> Mô Tả Chi Tiết
              (Description)
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Hình Ảnh (File Upload) */}
          <div className="form-group full-width file-upload-group">
            <label>
              <span className="icon-label">🖼️</span> Hình Ảnh (Image)
            </label>
            <div className="file-input-wrapper">
              <label htmlFor="image" className="custom-file-upload">
                Choose File
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                accept="image/*"
                multiple
              />
              <span className="file-name-display">{fileNameDisplay}</span>
            </div>
          </div>

          {/* HIỂN THỊ ẢNH XEM TRƯỚC */}
          {renderImagePreviews()}

          {/* Nút Submit */}
          <button type="submit" className="submit-button" disabled={loading}>
            Lưu Thông Tin Nhập Kho
          </button>
        </form>
      </div>
    </div>
  );
}
