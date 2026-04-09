// nfc-handler.js
async function initNFCReset() {
    if ("NDEFReader" in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = ({ message }) => {
                for (const record of message.records) {
                    // 取得 NFC 內的資料內容
                    const textDecoder = new TextDecoder(record.encoding || "utf-8");
                    const rawData = textDecoder.decode(record.data);

                    // 檢查這張卡片是不是你的「指揮官 URL」
                    // 只要內容包含你網址的一部分（例如你的檔名或網域）
                    if (rawData.includes("index.html") || rawData.includes("yourdomain")) {
                        // 執行重置：跳轉回第一頁
                        window.location.href = "index.html";
                    }
                }
            };
        } catch (e) {
            console.log("NFC 監聽啟動失敗: " + e);
        }
    }
}

// 進入頁面後自動啟動
// 注意：部分瀏覽器可能需要使用者點擊頁面後才能啟動掃描
document.addEventListener('click', () => {
    initNFCReset();
}, { once: true }); 

initNFCReset();
