import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import SectionTitle from "components/section-title";
import {Spinner} from "flowbite-react";
import ChartSelector from "components/chartSelector";

type CheckedChart = {
  id: number;
  name: string;
  description: string;
  order: number;
  checked: boolean;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [charts, setCharts] = useState<CheckedChart[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadCharts = async () => {
    setLoading(true);
    const response = await fetch("/api/charts/");
    const data = await response.json();
    setCharts(data.charts);
    setLoading(false);
  };

  const updateCharts = async () => {
    setSaving(true);
    const response = await fetch("/api/charts/supervisor", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({charts: charts}),
    });
    await response.json();
    setSaving(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadCharts();
    }
  }, [router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Graficos" subtitle="Configurar Graficos" />
        </div>
        <div></div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Info spinner example" />
          <div className="ml-2 mt-1">Cargando Graficos</div>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap">
          {charts &&
            charts.map((chart) => (
              <ChartSelector
                id={chart.id}
                key={chart.id}
                heading="Grafico"
                title={chart.name}
                description={chart.name}
                isChecked={chart.checked}
                onChange={(id, checked) => {
                  //change checked status in state
                  const newChartSelectors = charts.map((chart) => {
                    if (chart.id === id) {
                      return {...chart, checked: checked};
                    } else {
                      return chart;
                    }
                  });
                  setCharts(newChartSelectors);
                }}
              />
            ))}
        </div>
      )}

      <div className="flex justify-between mb-8">
        <div></div>
        <div>
          <button
            disabled={saving}
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => {
              updateCharts();
            }}>
            {saving && (
              <Spinner
                color="info"
                aria-label="Info spinner example"
                className="mr-3"
              />
            )}
            {saving ? "Guardando graficos" : "Guardar graficos"}
          </button>
        </div>
      </div>
    </>
  );
};
export default Index;
