import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Spinner, Table} from "flowbite-react";

type Template = {
  id: number;
  name: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTemplates = async () => {
    setLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/templates"
    );
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setTemplates(data.templates);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadTemplates();
    }
  }, [router, status]);

  const editTemplate = async (id: number) => {
    router.push(`/dashboard/supervisor/indicadores/editar/${id}`);
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle
            title="Plantillas de indicadores"
            subtitle="Listar Plantillas de indicadores"
          />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() =>
              router.push("/dashboard/supervisor/indicadores/plantillas/crear")
            }>
            Crear Plantilla nueva
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Cargando plantillas" />
          <div className="ml-2 mt-1">Cargando Plantillas de indicadores</div>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {templates?.map((template, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={index}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {template.name}
                </Table.Cell>
                <Table.Cell align="right" className="flex justify-end">
                  <Button
                    className="ml-5"
                    onClick={() => editTemplate(template.id)}>
                    Editar
                  </Button>
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
