import TemperatureChart from "@/components/charts/TemperatureChart";
import WaterCard from "@/components/cards/WaterCard";
import NodeCard from "@/components/cards/NodeCard";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
        <Header />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <NodeCard
            node="Node01"
            temperature={29.6}
            humidity={78}
            battery={91}
            status="ONLINE"
          />

          <NodeCard
            node="Node02"
            temperature={30.2}
            humidity={74}
            battery={87}
            status="ONLINE"
          />

          <NodeCard
            node="Node03"
            temperature={28.9}
            humidity={81}
            battery={94}
            status="ONLINE"
          />

          <NodeCard
            node="Node04"
            temperature={31.4}
            humidity={70}
            battery={76}
            status="ONLINE"
          />
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">
            魚塭水質監測
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <WaterCard title="水溫" value="27.8" unit="°C" />
            <WaterCard title="pH" value="7.32" />
            <WaterCard title="溶氧" value="6.81" unit="mg/L" />
            <WaterCard title="濁度" value="12" unit="NTU" />
          </div>
        </section>

        <section className="mt-8">
          <TemperatureChart />
        </section>
      </div>
    </main>
  );
}