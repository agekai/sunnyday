// nfc-handler.js
async function initGlobalNFC() {
    if ("NDEFReader" in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = ({ message }) => {
                for (const record of message.records) {
                    const textDecoder = new TextDecoder(record.encoding || "utf-8");
                    const rawData = textDecoder.decode(record.data).toLowerCase();
                    
                    // 偵測指揮官卡片 (關鍵字: pig)
                    if (rawData.includes("pig")) {
                        handleCommanderCard();
                    }
                }
            };
        } catch (e) {
            console.log("NFC 啟動失敗: " + e);
        }
    }
}

function handleCommanderCard() {
    // 取得目前是在哪一個 HTML 檔案
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "index.html" || currentPage === "") {
        // 如果在網頁 1 (登入頁)
        const overlay = document.getElementById("startOverlay");
        
        if (overlay && overlay.style.display !== "none") {
            // 狀態 A：還在登入畫面 -> 執行登入 (原本要輸入密碼，現在刷卡直接進去)
            // 如果你想保留「刷卡後自動填入密碼並登入」，可以這樣寫：
            const passInput = document.getElementById("passInput");
            if (passInput) passInput.value = "0411";
            
            // 呼叫原本網頁 1 定義好的 checkPass 函式
            if (typeof checkPass === "function") {
                checkPass(); 
            }
        } else {
            // 狀態 B：已經登入遊戲了 -> 執行重置
            window.location.reload();
        }
    } else {
        // 如果在網頁 2 或網頁 3 -> 直接跳回第一頁重新開始
        window.location.href = "index.html";
    }
}

// 啟動監聽
initGlobalNFC();