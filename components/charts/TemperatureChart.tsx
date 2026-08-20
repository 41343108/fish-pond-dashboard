"use client";

import ReactECharts from "echarts-for-react";

export default function TemperatureChart() {
  const option = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
    },

    grid: {
      left: 40,
      right: 20,
      top: 30,
      bottom: 30,
    },

    xAxis: {
      type: "category",
      data: [
        "00",
        "04",
        "08",
        "12",
        "16",
        "20",
        "24",
      ],
      axisLine: {
        lineStyle: {
          color: "#64748b",
        },
      },
      axisLabel: {
        color: "#94a3b8",
      },
    },

    yAxis: {
      type: "value",

      axisLine: {
        lineStyle: {
          color: "#64748b",
        },
      },

      splitLine: {
        lineStyle: {
          color: "#1e293b",
        },
      },

      axisLabel: {
        color: "#94a3b8",
      },
    },

    series: [
      {
        name: "Temperature",

        type: "line",

        smooth: true,

        data: [28, 29, 30, 31, 30, 29, 28],

        lineStyle: {
          width: 4,
          color: "#06b6d4",
        },

        itemStyle: {
          color: "#06b6d4",
        },

        areaStyle: {
          color: "rgba(6,182,212,0.15)",
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-white">
        24 小時溫度變化
      </h2>

      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
}