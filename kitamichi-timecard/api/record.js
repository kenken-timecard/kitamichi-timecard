// Google Apps Script で発行したURLを使う簡易版（けんけん仕様）
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 👇 ここにけんけんのGAS URLを設定
    const GAS_URL = "https://script.google.com/macros/s/AKfycbxVBfq1H4Ndlzs_keRBUmiJXabhEFciRQC6cgYghctXhuwDR9ES5INJnvsX2zSZEXtS/exec";

    // フロント側（出勤ボタンなど）から送られたデータを受け取る
    const { name, action, selectedTime, recordedAt } = req.body;

    // GASにデータを送信
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, action, selectedTime, recordedAt }),
    });

    const result = await response.text();
    res.status(200).json({ status: "success", result });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to send data to GAS" });
  }
}
