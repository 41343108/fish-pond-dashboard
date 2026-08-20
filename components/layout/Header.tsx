export default function Header() {
  return (
    <header className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-cyan-400">
          LoRa Mesh Fish Monitoring
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white">
          魚塭智慧監測系統
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          虎尾科技大學
        </p>
      </div>

      <div className="sm:text-right">
        <p className="text-sm text-slate-400">系統狀態</p>

        <div className="mt-2 inline-flex items-center rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-400">
          ● ONLINE
        </div>
      </div>
    </header>
  );
}