import { toast } from "react-toastify";

/**
 * Hiển thị thông báo lỗi với nút OK
 * @param {string} message - Nội dung thông báo lỗi
 */
export const toastError = (message) => {
  toast.error(
    ({ closeToast }) => (
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "10px" }}>{message}</div>
        <button
          onClick={closeToast}
          style={{
            padding: "6px 16px",
            background: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          OK
        </button>
      </div>
    ),
    {
      autoClose: false, // ❌ Không tự đóng
      closeOnClick: false,
      draggable: false,
      pauseOnHover: false,
      position: "top-center",
      theme: "colored",
    }
  );
};
