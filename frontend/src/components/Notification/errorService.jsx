let _showErrorHandler = null;

export const registerErrorHandler = (handler) => {
  console.log("✅ Error handler registered");
  _showErrorHandler = handler;
};

export const showError = (message) => {
  console.log("⚡ showError called:", message);
  if (_showErrorHandler) {
    _showErrorHandler(message);
    return new Promise((resolve) => {
      window._onErrorModalClose = resolve;
    });
  } else {
    console.error("❌ Error handler chưa được đăng ký!");
    return Promise.resolve();
  }
};
