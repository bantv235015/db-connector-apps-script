// =================================================================
// FILE: Code.gs (CLIENT PROJECT - Gateway Architecture)
// Vai trò: Trung gian giữa Giao diện người dùng và Thư viện Lõi.
// =================================================================

// [QUAN TRỌNG] Dán URL Raw của Gist mà bạn đã tạo vào đây.
const GIST_URL = 'https://gist.githubusercontent.com/opendbvn/d303858f328673b780f0faa44a8a1eeb/raw/4e1680164b49c3f1810af4a0829977cb54ae823b/sidebar.html';

/**
 * Hàm này được tự động chạy mỗi khi người dùng mở file Google Sheet.
 * Nó tạo ra menu tùy chỉnh cho phần mềm.
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('DB CONNECTOR ™')
      .addItem('Start DB Connector', 'showMainSidebar')
      .addSeparator()
      .addItem('Tài khoản', 'showAccountPlaceholder')
      .addSeparator()
      .addItem('Báo giá', 'openPricingPage')
      .addItem('Hướng dẫn', 'openDocsPage')
      .addItem('Hỗ trợ', 'openSupportPage')
      .addToUi();
  } catch (e) {
    Logger.log('Không thể tạo menu UI: ' + e.toString());
  }
}

/**
 * Tải nội dung HTML từ Gist và hiển thị sidebar.
 */
function showMainSidebar() {
  try {
    // Tải HTML từ Gist thay vì từ file cục bộ
    //const htmlContent = UrlFetchApp.fetch(GIST_URL).getContentText();
    // const htmlOutput = HtmlService.createHtmlOutput(htmlContent)
    //   .setTitle('DB CONNECTOR ™');
    const htmlOutput = HtmlService.createTemplateFromFile('sidebar')
      .evaluate()
      .setTitle('DB Connecter');
    SpreadsheetApp.getUi().showSidebar(htmlOutput);
  } catch (err) {
    if (err.message.includes('File not found')) {
      SpreadsheetApp.getUi().alert('Không tìm thấy file HTML cần thiết.');
    } else {
      SpreadsheetApp.getUi().alert('Lỗi không xác định: ' + err.message);
    }
    Logger.log(err.stack); // log đầy đủ stack trace
  }
}

// =================================================================
// HÀM CỔNG (GATEWAY FUNCTION)
// Đây là hàm trung gian duy nhất. Mọi yêu cầu từ giao diện người dùng
// sẽ đi qua hàm này để gọi đến Thư viện Lõi.
// =================================================================

/**
 * Calls a function in the Core library.
 * @param {string} functionName The name of the function to call in the Core library.
 * @param {Array} args An array of arguments to pass to the function.
 * @returns {*} The result from the Core library function.
 */
function callLibrary(functionName, args) {
  // "Core" là Giá trị nhận dạng (Identifier) mà chúng ta đã đặt khi thêm thư viện.
  // Dùng toán tử spread (...) để truyền các tham số trong mảng 'args' vào hàm.
  return Core[functionName](...args);
}

// =================================================================
// CÁC HÀM CỦA MENU (Vẫn cần giữ lại ở đây)
// =================================================================

function showAccountPlaceholder() {
  SpreadsheetApp.getUi().alert("Thông báo", "Chức năng 'Tài khoản' sẽ được phát triển trong phiên bản sau.", SpreadsheetApp.getUi().ButtonSet.OK);
}

function openUrlInNewTab(url) {
  const html = `<script>window.open('${url}', '_blank'); google.script.host.close();</script>`;
  const htmlOutput = HtmlService.createHtmlOutput(html).setWidth(100).setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Đang mở...');
}

function openPricingPage() {
  openUrlInNewTab('https://dbconnector.vn/pricing');
}

function openDocsPage() {
  openUrlInNewTab('https://dbconnector.vn/docs');
}

function openSupportPage() {
  openUrlInNewTab('https://dbconnector.vn/support');
}
function test(){
  Core.ping();
}
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}