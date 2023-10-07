import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Spinner, Table} from "flowbite-react";

type Chart = {
  id: number;
  name: string;
  description: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCharts = async () => {
    setLoading(true);
    const response = await fetch("/api/charts");
    const data = await response.json();
    setCharts(data.charts);
    setLoading(false);
  };

  const deleteChart = async (id: number) => {
    //prompt the user to confirm
    const confirm = window.confirm("¿Estás seguro de eliminar este grafico?");
    if (confirm) {
      setLoading(true);
      //delete the user
      const response = await fetch("/api/charts/" + id, {
        method: "DELETE",
      });
      await response.json();
      loadCharts();
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadCharts();
    }
  }, [router, status]);

  const editChart = async (id: number) => {
    router.push(`/dashboard/super/graficos/${id}`);
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Graficos" subtitle="Lista de graficos" />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/super/graficos/crear")}>
            Crear Grafico
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Info spinner example" />
          <div className="ml-2 mt-1">Cargando Graficos</div>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Descripcion</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Editar</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {charts.map((chart) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {chart.name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {chart.description}
                </Table.Cell>
                <Table.Cell align="right">
                  <div className="flex flex-row justify-end">
                    <Button onClick={() => editChart(chart.id)} className="">
                      Editar
                    </Button>

                    <Button
                      onClick={() => deleteChart(chart.id)}
                      className="ml-5">
                      Borrar
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  );
};
export default Index;
