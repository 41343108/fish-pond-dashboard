type NodeCardProps = {
  node: string;
  temperature: number | null;
  humidity: number | null;
  battery: number | null;
  status: "ONLINE" | "OFFLINE";
};

export default function NodeCard({
  node,
  temperature,
  humidity,
  battery,
  status,
}: NodeCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          {node}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            status === "ONLINE"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">

        <div className="rounded-xl bg-slate-800 p-3">
          <p className="text-xs text-slate-400">
            溫度
          </p>

          <p className="mt-1 text-xl font-bold text-cyan-300">
            {temperature !== null
              ? `${temperature.toFixed(1)}°C`
              : "--"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-3">
          <p className="text-xs text-slate-400">
            濕度
          </p>

          <p className="mt-1 text-xl font-bold text-cyan-300">
            {humidity !== null
              ? `${humidity.toFixed(1)}%`
              : "--"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-3">
          <p className="text-xs text-slate-400">
            電池
          </p>

          <p className="mt-1 text-xl font-bold text-yellow-300">
            {battery !== null
              ? `${battery.toFixed(0)}%`
              : "--"}
          </p>
        </div>

      </div>
    </div>
  );
}