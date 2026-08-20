import TemperatureChart from "@/components/charts/TemperatureChart";
import WaterCard from "@/components/cards/WaterCard";
import NodeCard from "@/components/cards/NodeCard";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, error } = await supabase
    .from("sensor_data")
    .select("*")
    .eq("node", "Node01")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Supabase error:", error);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <NodeCard
            node="Node01"
            temperature={data?.air_temp ?? 0}
            humidity={data?.humidity ?? 0}
            battery={data?.battery ?? 0}
            status={data ? "ONLINE" : "OFFLINE"}
          />

          <NodeCard
            node="Node02"
            temperature={30.2}
            humidity={74}
            battery={87}
            status="OFFLINE"
          />

          <NodeCard
            node="Node03"
            temperature={28.9}
            humidity={81}
            battery={94}
            status="OFFLINE"
          />

          <NodeCard
            node="Node04"
            temperature={31.4}
            humidity={70}
            battery={76}
            status="OFFLINE"
          />
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">
            無線水質監測
          </h2>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <WaterCard
              title="水溫"
              value={data?.water_temp?.toString() ?? "--"}
              unit="°C"
            />

            <WaterCard
              title="pH"
              value={data?.ph?.toString() ?? "--"}
            />

            <WaterCard
              title="EC"
              value={data?.ec?.toString() ?? "--"}
              unit="μS/cm"
            />

            <WaterCard
              title="TDS"
              value={data?.tds?.toString() ?? "--"}
              unit="ppm"
            />
          </div>
        </section>

        <section className="mt-8">
          <TemperatureChart />
        </section>

        <section className="mt-6 text-sm text-slate-400">
          <p>
            資料來源：Supabase / sensor_data
          </p>

          <p>
            最後更新：
            {data?.created_at
              ? new Date(data.created_at).toLocaleString("zh-TW", {
                  timeZone: "Asia/Taipei",
                })
              : "尚無資料"}
          </p>
        </section>
      </div>
    </main>
  );
}