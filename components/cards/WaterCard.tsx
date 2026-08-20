type WaterCardProps = {
  title: string;
  value: string;
  unit?: string;
};

export default function WaterCard({
  title,
  value,
  unit,
}: WaterCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <p className="text-sm text-slate-400">{title}</p>

      <div className="mt-3 flex items-end gap-1">
        <span className="text-3xl font-bold text-cyan-300">
          {value}
        </span>

        {unit && (
          <span className="pb-1 text-sm text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}