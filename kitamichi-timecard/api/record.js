import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const sheetId = process.env.SHEET_ID;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const { name, action, selectedTime, recordedAt } = req.body;

    const date = new Date(recordedAt).toLocaleDateString("ja-JP");
    const recordedTime = new Date(recordedAt).toLocaleTimeString("ja-JP");

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "勤怠!A:E",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[date, name, action, selectedTime, recordedTime]],
      },
    });

    res.status(200).json({ message: "OK" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to write to sheet" });
  }
}
