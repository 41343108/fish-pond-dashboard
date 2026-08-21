"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabase";

type SensorRow = {
  id: number;
  node: string;
  air_temp: number | null;
  humidity: number | null;
  created_at: string;
};

type HourlyData = {
  hour: string;
  temperature: number | null;
  humidity: number | null;
  count: number;
};

function formatTaiwanDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export default function HistoryViewer() {
  const [selectedDate, setSelectedDate] = useState(
    formatTaiwanDate(new Date())
  );

  const [rows, setRows] = useState<SensorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);

      // 台灣時間 00:00 對應 UTC 前一天 16:00
      const start = new Date(`${selectedDate}T00:00:00+08:00`);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const { data, error } = await supabase
        .from("sensor_data")
        .select("id,node,air_temp,humidity,created_at")
        .eq("node", "Node01")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: true });

      if (error) {
        console.error("歷史資料讀取失敗：", error);
        setRows([]);
      } else {
        setRows(data ?? []);
      }

      setLoading(false);
    }

    loadHistory();
  }, [selectedDate]);

  const hourlyData = useMemo<HourlyData[]>(() => {
    const buckets = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${String(hour).padStart(2, "0")}:00`,
      tempTotal: 0,
      tempCount: 0,
      humidityTotal: 0,
      humidityCount: 0,
    }));

    for (const row of rows) {
      const taiwanTime = new Date(
        new Date(row.created_at).toLocaleString("en-US", {
          timeZone: "Asia/Taipei",
        })
      );

      const hour = taiwanTime.getHours();
      const bucket = buckets[hour];

      if (row.air_temp !== null) {
        bucket.tempTotal += row.air_temp;
        bucket.tempCount += 1;
      }

      if (row.humidity !== null) {
        bucket.humidityTotal += row.humidity;
        bucket.humidityCount += 1;
      }
    }

    return buckets.map((bucket) => ({
      hour: bucket.hour,
      temperature:
        bucket.tempCount > 0
          ? Number((bucket.tempTotal / bucket.tempCount).toFixed(1))
          : null,
      humidity:
        bucket.humidityCount > 0
          ? Number(
              (bucket.humidityTotal / bucket.humidityCount).toFixed(1)
            )
          : null,
      count: bucket.tempCount,
    }));
  }, [rows]);

  const minuteData = useMemo(() => {
  if (selectedHour === null) return [];

  const buckets = Array.from({ length: 60 }, (_, minute) => ({
    minute: String(minute).padStart(2, "0"),
    tempTotal: 0,
    tempCount: 0,
  }));

  for (const row of rows) {
    const taiwanTime = new Date(
      new Date(row.created_at).toLocaleString("en-US", {
        timeZone: "Asia/Taipei",
      })
    );

    if (taiwanTime.getHours() !== selectedHour) {
      continue;
    }

    const minute = taiwanTime.getMinutes();

    if (row.air_temp !== null) {
      buckets[minute].tempTotal += row.air_temp;
      buckets[minute].tempCount += 1;
    }
  }

  return buckets.map((bucket) => ({
    minute: bucket.minute,
    temperature:
      bucket.tempCount > 0
        ? Number((bucket.tempTotal / bucket.tempCount).toFixed(1))
        : null,
    count: bucket.tempCount,
  }));
}, [rows, selectedHour]);

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">歷史資料查詢</h2>
          <p className="mt-1 text-sm text-slate-400">
            依日期查看 Node01 每小時平均資料
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">
            選擇日期
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            一天溫度 24 小時變化
          </h3>

          <p className="text-sm text-slate-400">
            每一點代表該小時所有資料的平均溫度
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            讀取歷史資料中...
          </div>
        ) : (
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis unit="°C" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="平均溫度"
                  unit="°C"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">時間</th>
              <th className="px-4 py-3 text-left">平均溫度</th>
              <th className="px-4 py-3 text-left">平均濕度</th>
              <th className="px-4 py-3 text-left">資料筆數</th>
            </tr>
          </thead>

          <tbody>
            {hourlyData.map((item) => (
              <tr
                key={item.hour}
                onClick={() => {
                    const hour = Number(item.hour.slice(0, 2));

                    if (item.count > 0) {
                        setSelectedHour(hour);
                    }
                 }}
                className={`border-b border-slate-800/60 ${
                    item.count > 0
                    ? "cursor-pointer hover:bg-slate-800/50"
                    : ""
                } ${
                    selectedHour === Number(item.hour.slice(0, 2))
                        ? "bg-slate-800/70"
                        : ""
                    }`}
                >
                <td className="px-4 py-3">{item.hour}</td>

                <td className="px-4 py-3">
                  {item.temperature !== null
                    ? `${item.temperature}°C`
                    : "--"}
                </td>

                <td className="px-4 py-3">
                  {item.humidity !== null
                    ? `${item.humidity}%`
                    : "--"}
                </td>

                <td className="px-4 py-3">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            {selectedHour !== null && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4">
            <h3 className="text-lg font-semibold">
                一小時 60 分鐘溫度變化
            </h3>

            <p className="text-sm text-slate-400">
                {selectedDate}{" "}
                {String(selectedHour).padStart(2, "0")}:00 ～{" "}
                {String(selectedHour).padStart(2, "0")}:59
            </p>

            <p className="mt-1 text-sm text-slate-500">
                測試期間同一分鐘若有多筆資料，會自動計算該分鐘平均溫度
            </p>
            </div>

            <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={minuteData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    dataKey="minute"
                    interval={4}
                    tickFormatter={(value) => `${value}分`}
                />

                <YAxis unit="°C" />

                <Tooltip
                    labelFormatter={(value) =>
                    `${String(selectedHour).padStart(2, "0")}:${value}`
                    }
                />

                <Line
                    type="monotone"
                    dataKey="temperature"
                    name="平均溫度"
                    unit="°C"
                    connectNulls={false}
                />
                </LineChart>
            </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {minuteData
                .filter((item) => item.temperature !== null)
                .map((item) => (
                <div
                    key={item.minute}
                    className="rounded-lg bg-slate-800 p-3"
                >
                    <div className="text-xs text-slate-400">
                    {String(selectedHour).padStart(2, "0")}:{item.minute}
                    </div>

                    <div className="mt-1 font-semibold text-cyan-400">
                    {item.temperature}°C
                    </div>

                    <div className="text-xs text-slate-500">
                    {item.count} 筆
                    </div>
                </div>
                ))}
            </div>
        </div>
        )}
    </section>
  );
}