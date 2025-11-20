/* eslint-disable no-undef */

// ==== BrowserPrint Core (Zebra SDK local JS) ====
const BrowserPrint = (function () {
  function makeUrl(path) {
    return baseUrl + path;
  }

  function createRequest(method, url) {
    let req = new XMLHttpRequest();
    if ("withCredentials" in req) {
      req.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
      req = new XDomainRequest();
      req.open(method, url);
    } else {
      req = null;
    }
    return req;
  }

  function attachCallbacks(ctx, xhr, success, error) {
    if (ctx !== undefined) {
      if (success === undefined) success = ctx.sendFinishedCallback;
      if (error === undefined) error = ctx.sendErrorCallback;
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) success(xhr.responseText);
        else error(xhr.responseText);
      }
    };
  }

  const version = 2;
  let baseUrl = location.protocol === "https:" ? "https://localhost:9101/" : "http://localhost:9100/";

  const t = {};

  // ==== Device Class ====
  t.Device = function (d) {
    const self = this;
    Object.assign(this, d);
    this.version = version;

    this.sendErrorCallback = () => {};
    this.sendFinishedCallback = () => {};

    this.send = function (data, onSuccess, onError) {
      const req = createRequest("POST", makeUrl("write"));
      if (req) {
        attachCallbacks(self, req, onSuccess, onError);
        req.send(JSON.stringify({ device: d, data }));
      }
    };

    this.read = function (onSuccess, onError) {
      const req = createRequest("POST", makeUrl("read"));
      if (req) {
        attachCallbacks(self, req, onSuccess, onError);
        req.send(JSON.stringify({ device: d }));
      }
    };

    this.sendThenRead = function (data, onSuccess, onError) {
      this.send(data, () => this.read(onSuccess, onError), onError);
    };
  };

  // ==== API ====
  t.getDefaultDevice = function (type, onSuccess, onError) {
    let url = "default";
    if (type) url += `?type=${type}`;
    const req = createRequest("GET", makeUrl(url));
    if (req) {
      const done = (res) => {
        if (!res) return onSuccess(null);
        const device = new t.Device(JSON.parse(res));
        onSuccess(device);
      };
      attachCallbacks(undefined, req, done, onError);
      req.send();
    }
  };

  return t;
})();

// ==== Global variables ====
// eslint-disable-next-line no-unused-vars
let defaultMode = false;
let selectedPrinter = null;
// eslint-disable-next-line no-unused-vars
let availablePrinters = null;
// eslint-disable-next-line no-unused-vars
let defaultPrinter = null;


// ==== API functions ====
export function setupWebPrint(callback) {
  defaultMode = true;
  selectedPrinter = null;
  availablePrinters = null;
  defaultPrinter = null;

  BrowserPrint.getDefaultDevice(
    "printer",
    function (printer) {
      defaultPrinter = printer;
      if (printer && printer.connection !== undefined) {
        selectedPrinter = printer;
        console.log(`✅ Đã kết nối máy in: ${printer.name}`);
        if (callback) callback(true, printer.name);
      } else {
        console.warn("⚠️ Không tìm thấy máy in Zebra.");
        if (callback) callback(false, null);
      }
    },
    function (err) {
      console.error("❌ Lỗi kết nối máy in:", err);
      if (callback) callback(false, null);
    }
  );
}

export function getPrinterName() {
  return selectedPrinter?.name || "(Unknown)";
}

export function checkPrinterStatus(callback) {
  if (!selectedPrinter) {
    callback("No printer connected");
    return;
  }

  selectedPrinter.sendThenRead(
    "~HQES",
    function (text) {
      const statuses = [];
      const isError = text.charAt(70);
      const media = text.charAt(88);
      const head = text.charAt(87);
      const pause = text.charAt(84);

      if (isError === "0") statuses.push("Ready to Print");
      if (media === "1") statuses.push("Paper out");
      if (media === "2") statuses.push("Ribbon Out");
      if (media === "4") statuses.push("Media Door Open");
      if (media === "8") statuses.push("Cutter Fault");
      if (head === "1") statuses.push("Printhead Overheating");
      if (head === "2") statuses.push("Motor Overheating");
      if (head === "4") statuses.push("Printhead Fault");
      if (head === "8") statuses.push("Incorrect Printhead");
      if (pause === "1") statuses.push("Printer Paused");

      callback(statuses.join(", "));
    },
    () => callback("Error reading status")
  );
}

export function sendZplCode(zplCode) {
  if (!selectedPrinter) {
    alert("⚠️ Chưa kết nối máy in.");
    return false;
  }
  try {
    const processedZpl = zplCode;
    selectedPrinter.send(processedZpl, () => console.log("✅ In xong nhãn."), () => alert("Lỗi khi in."));
    return true;
  } catch (e) {
    alert(`Lỗi in: ${e.message}`);
    return false;
  }
}

export function sendZplCodeList(zplList) {
  if (!Array.isArray(zplList)) return;
  zplList.forEach((zpl) => sendZplCode(zpl));
}

