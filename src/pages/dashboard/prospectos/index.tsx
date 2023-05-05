import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Table} from "flowbite-react";

type Prospect = {
  id: number;
  firstName: string;
  lastName: string;
  cellphone: string;
  email: string;
  ownerId: number;
  owner: {
    id: number;
  };
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [prospects, setProspects] = useState<Prospect[]>([]);

  const loadProspects = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/prospects"
    );
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setProspects(data.prospects);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadProspects();
    }
  }, [router, status]);

  const editProspect = async (id: number) => {
    router.push(`/dashboard/prospectos/${id}`);
  };

  const showProcesses = async (id: number) => {
    router.push(`/dashboard/prospectos/${id}/procesos`);
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Prospectos" subtitle="Listar Prospectos" />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/prospectos/crear")}>
            Crear Prospecto
          </button>
        </div>
      </div>

      <Table>
        <Table.Head>
          <Table.HeadCell>Nombre</Table.HeadCell>
          <Table.HeadCell>Apellido</Table.HeadCell>
          <Table.HeadCell>Celular</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Editar</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {prospects.map((prospect) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {prospect.firstName}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {prospect.lastName}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {prospect.cellphone}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {prospect.email}
              </Table.Cell>
              <Table.Cell align="right">
                <div className="flex flex-row justify-end">
                  <Button
                    onClick={() => editProspect(prospect.id)}
                    className="">
                    Editar
                  </Button>
                  <Button
                    onClick={() => showProcesses(prospect.id)}
                    className="ml-3">
                    Procesos (2)
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
export default Index;
