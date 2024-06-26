import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import SectionTitle from "components/section-title";
import {Spinner} from "flowbite-react";
import Indicator from "components/indicator";

type CheckedIndicator = {
  id: number;
  name: string;
  order: number;

  source: {
    id: number;
    name: string;
  };
  checked: boolean;
  associated_function: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [indicators, setIndicators] = useState<CheckedIndicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadIndicators = async () => {
    setLoading(true);
    const response = await fetch("/api/indicators");
    const data = await response.json();
    setIndicators(data.indicators?.indicators);
    setLoading(false);
  };

  const updateIndicators = async () => {
    setSaving(true);
    const response = await fetch("/api/indicators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({indicators: indicators}),
    });
    await response.json();
    setSaving(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadIndicators();
    }
  }, [router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Indicadores" subtitle="Configurar Indicadores" />
        </div>
        <div></div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Info spinner example" />
          <div className="ml-2 mt-1">Cargando Indicadores</div>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap">
          {indicators &&
            indicators.map((indicator) => (
              <Indicator
                associated_function={indicator.associated_function}
                key={indicator.id}
                title={indicator.source.name}
                description={indicator.name}
                isChecked={indicator.checked}
                onChange={(associated_function, checked) => {
                  //change checked status in state
                  const newIndicators = indicators.map((indicator) => {
                    if (indicator.associated_function === associated_function) {
                      return {...indicator, checked: checked};
                    } else {
                      return indicator;
                    }
                  });
                  setIndicators(newIndicators);
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
              updateIndicators();
            }}>
            {saving && (
              <Spinner
                color="info"
                aria-label="Info spinner example"
                className="mr-3"
              />
            )}
            {saving ? "Guardando indicadores" : "Guardar indicadores"}
          </button>
        </div>
      </div>
    </>
  );
};
export default Index;
