let _showMessageHandler = null;

export const registerMessageHandler = (handler) => {
  console.log("✅ Message handler registered");
  _showMessageHandler = handler;
};

export const showMessage = (message, type = "error", details = null) => {
  console.log("⚡ showMessage called:", message, type);
  if (_showMessageHandler) {
    _showMessageHandler({ message, type , details});
    return new Promise((resolve) => {
      window._onMessageModalClose = resolve;
    });
  } else {
    console.error("❌ Message handler chưa được đăng ký!");
    return Promise.resolve();
  }
};
