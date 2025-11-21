import { useState } from "react";
import ConfirmModal from "./ConfirmModal.jsx";

export function useConfirm() {
  const [modal, setModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const confirm = (message) => {
    return new Promise((resolve) => {
      setModal({
        show: true,
        message,
        onConfirm: () => {
          resolve(true);
          setModal((m) => ({ ...m, show: false }));
        },
        onCancel: () => {
          resolve(false);
          setModal((m) => ({ ...m, show: false }));
        },
      });
    });
  };

  const ConfirmUI = (
    <ConfirmModal
      show={modal.show}
      message={modal.message}
      onConfirm={modal.onConfirm}
      onCancel={modal.onCancel}
    />
  );

  return { confirm, ConfirmUI };
}
