// nfc-handler.js

async function initNFCReset() {
    if ("NDEFReader" in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            
            console.log("NFC 監聽已在背景啟動（準備接收重置指令）");

            ndef.onreading = ({ message }) => {
                for (const record of message.records) {
                    const textDecoder = new TextDecoder(record.encoding || "utf-8");
                    const rawData = textDecoder.decode(record.data).toLowerCase();

                    console.log("偵測到 NFC 資料:", rawData);

                    // 核心邏輯：感應到指揮官卡 (URL 包含 index.html 或 pig 字樣)
                    if (rawData.includes("index.html") || rawData.includes("pig")) {
                        
                        // 1. 視覺效果：畫面瞬間閃白並淡出
                        document.body.style.transition = "all 0.3s";
                        document.body.style.backgroundColor = "white";
                        document.body.style.opacity = "0";

                        // 2. 執行重置跳轉
                        setTimeout(() => {
                            // 跳回首頁，並加上時間戳防止快取
                            window.location.href = "index.html?from=reset_" + Date.now();
                        }, 300);
                        
                        return; // 結束處理
                    }
                }
            };
        } catch (e) {
            console.log("NFC 監聽啟動失敗（可能是權限問題）: " + e);
        }
    }
}

// 監聽點擊事件來激活 NFC
// 手機瀏覽器通常需要使用者點擊過頁面，JavaScript 才能啟動讀卡機
document.addEventListener('click', () => {
    initNFCReset();
}, { once: false }); // 允許重複點擊嘗試啟動

// 初始化嘗試啟動
initNFCReset();
