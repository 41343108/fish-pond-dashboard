import TemperatureChart from "@/components/charts/TemperatureChart";
import WaterCard from "@/components/cards/WaterCard";
import NodeCard from "@/components/cards/NodeCard";
import Header from "@/components/layout/Header";
import AutoRefresh from "@/components/AutoRefresh";
import { supabase } from "@/lib/supabase";
import HistoryViewer from "@/components/HistoryViewer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { data: rows, error } = await supabase
  .from("sensor_data")
  .select("*")
  .in("node", ["Node01", "Node02", "Node03", "Node04"])
  .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
  }
  const latestByNode = new Map();

for (const row of rows ?? []) {
  if (!latestByNode.has(row.node)) {
    latestByNode.set(row.node, row);
  }
}

const node01 = latestByNode.get("Node01");
const node02 = latestByNode.get("Node02");
const node03 = latestByNode.get("Node03");
const node04 = latestByNode.get("Node04");

function getNodeStatus(nodeData: any): "ONLINE" | "OFFLINE" {
  if (!nodeData?.created_at) {
    return "OFFLINE";
  }

  const lastUpdate = new Date(nodeData.created_at).getTime();
  const now = Date.now();

  const diffMinutes = (now - lastUpdate) / 1000 / 60;

  return diffMinutes <= 2 ? "ONLINE" : "OFFLINE";
}

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">
      <AutoRefresh />

      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <NodeCard
  node="Node01"
  temperature={node01?.air_temp ?? null}
  humidity={node01?.humidity ?? null}
  battery={node01?.battery ?? null}
  status={getNodeStatus(node01)}
/>

<NodeCard
  node="Node01"
  temperature={
    getNodeStatus(node01) === "ONLINE" ? node01?.air_temp ?? null : null
  }
  humidity={
    getNodeStatus(node01) === "ONLINE" ? node01?.humidity ?? null : null
  }
  battery={
    getNodeStatus(node01) === "ONLINE" ? node01?.battery ?? null : null
  }
  status={getNodeStatus(node01)}
/>

<NodeCard
  node="Node02"
  temperature={
    getNodeStatus(node02) === "ONLINE" ? node02?.air_temp ?? null : null
  }
  humidity={
    getNodeStatus(node02) === "ONLINE" ? node02?.humidity ?? null : null
  }
  battery={
    getNodeStatus(node02) === "ONLINE" ? node02?.battery ?? null : null
  }
  status={getNodeStatus(node02)}
/>

<NodeCard
  node="Node03"
  temperature={
    getNodeStatus(node03) === "ONLINE" ? node03?.air_temp ?? null : null
  }
  humidity={
    getNodeStatus(node03) === "ONLINE" ? node03?.humidity ?? null : null
  }
  battery={
    getNodeStatus(node03) === "ONLINE" ? node03?.battery ?? null : null
  }
  status={getNodeStatus(node03)}
/>

<NodeCard
  node="Node04"
  temperature={
    getNodeStatus(node04) === "ONLINE" ? node04?.air_temp ?? null : null
  }
  humidity={
    getNodeStatus(node04) === "ONLINE" ? node04?.humidity ?? null : null
  }
  battery={
    getNodeStatus(node04) === "ONLINE" ? node04?.battery ?? null : null
  }
  status={getNodeStatus(node04)}
/>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">
            無線水質監測
          </h2>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <WaterCard
  title="水溫"
  value={node01?.water_temp?.toString() ?? "--"}
  unit="°C"
/>

<WaterCard
  title="pH"
  value={node01?.ph?.toString() ?? "--"}
/>

<WaterCard
  title="EC"
  value={node01?.ec?.toString() ?? "--"}
  unit="μS/cm"
/>

<WaterCard
  title="TDS"
  value={node01?.tds?.toString() ?? "--"}
  unit="ppm"
/>
          </div>
        </section>

        <section className="mt-8">
          <TemperatureChart />
        </section>
        <HistoryViewer />

        <section className="mt-6 text-sm text-slate-400">
          <p>
            資料來源：Supabase / sensor_data
          </p>

          <p>
            最後更新：
            {node01?.created_at
  ? new Date(node01.created_at).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
    })
  : "尚無資料"}
          </p>
        </section>
      </div>
    </main>
  );
}