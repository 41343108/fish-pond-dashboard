import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PORT = "COM9";
const BAUD_RATE = 115200;

const API_URL =
  "https://fish-pond-dashboard.vercel.app/api/sensor";

const API_KEY = process.env.INGEST_API_KEY;

if (!API_KEY) {
  console.error("找不到 INGEST_API_KEY");
  process.exit(1);
}

const port = new SerialPort({
  path: PORT,
  baudRate: BAUD_RATE,
});

const parser = port.pipe(
  new ReadlineParser({ delimiter: "\n" })
);

console.log("====================================");
console.log("LoRa 魚塭資料轉發程式");
console.log(`COM Port : ${PORT}`);
console.log(`Baud Rate: ${BAUD_RATE}`);
console.log("等待 LoRa 資料...");
console.log("====================================");

port.on("open", () => {
  console.log(`✅ ${PORT} 已成功開啟`);
});

port.on("error", (err) => {
  console.error("❌ Serial Port 錯誤：", err.message);
});

parser.on("data", async (rawLine) => {
  const line = rawLine.trim();

  if (!line) return;

  console.log("收到：", line);

  let temperature = null;
  let humidity = null;

  // 支援原始 LoRa 格式：
  // POND_DATA,27.8,49.7
  if (line.includes("POND_DATA")) {
    const match = line.match(
      /POND_DATA\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/
    );

    if (match) {
      temperature = Number(match[1]);
      humidity = Number(match[2]);
    }
  }

  // 支援目前 COM9 顯示格式：
  // 溫度：27.8 °C | 濕度：49.7 %
  if (temperature === null || humidity === null) {
    const tempMatch = line.match(
      /溫度[：:]\s*(-?\d+(?:\.\d+)?)/
    );

    const humMatch = line.match(
      /濕度[：:]\s*(-?\d+(?:\.\d+)?)/
    );

    if (tempMatch) {
      temperature = Number(tempMatch[1]);
    }

    if (humMatch) {
      humidity = Number(humMatch[1]);
    }
  }

  if (temperature === null || humidity === null) {
    return;
  }

  console.log(
    `📡 解析成功：溫度=${temperature}°C，濕度=${humidity}%`
  );

  const body = {
    node: "Node01",
    airTemp: temperature,
    humidity: humidity,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ API 上傳失敗：", result);
      return;
    }

    console.log("✅ 已寫入 Supabase");
    console.log(
      `Node01 → ${temperature}°C / ${humidity}%`
    );
    console.log("------------------------------------");
  } catch (err) {
    console.error("❌ 網路上傳錯誤：", err.message);
  }
});