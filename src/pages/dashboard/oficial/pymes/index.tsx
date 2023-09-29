import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Spinner, Table} from "flowbite-react";
import Link from "next/link";
import {FiLink} from "react-icons/fi";
import {FaWhatsapp} from "react-icons/fa";

type Prospect = {
  id: number;
  rfc: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  email: string;
  ownerId: number;
  uuid: string;
  satwsid: string;
  companyName: string;
  owner: {
    id: number;
  };
  credentials_status: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadProspects = async () => {
    setLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/prospects"
    );
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setProspects(data.prospects);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadProspects();
    }
  }, [router, status]);

  const viewClient = async (uuid: string) => {
    router.push(`/dashboard/oficial/pymes/edit/${uuid}`);
  };

  const showProcesses = async (id: number) => {
    router.push(`/dashboard/oficial/pymes/${id}/reportes`);
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Clientes" subtitle="Listar Clientes" />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/oficial/pymes/crear")}>
            Crear Cliente
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <div className="text-gray-500 w-full text-center p-5">
            <Spinner color="info" aria-label="Info spinner example" />
            <div className="ml-2 mt-1">Cargando Clientes...</div>
          </div>
        </div>
      ) : prospects?.length === 0 ? (
        <div className="flex justify-center">
          <div className="text-gray-500 w-full text-center p-5">
            No hay Clientes todavía.
            <br></br>
            <Link legacyBehavior href="/dashboard/oficial/pymes/crear">
              <a className="text-blue-500 hover:text-blue-700">
                Crear Nuevo Cliente
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>RFC</Table.HeadCell>
            <Table.HeadCell>Empresa</Table.HeadCell>
            <Table.HeadCell>Celular</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Editar</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {prospects?.map((prospect, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 align-baseline"
                key={index}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <span
                    className={
                      prospect.credentials_status === "pending"
                        ? "text-amber-200"
                        : prospect.credentials_status === "rejected"
                        ? "text-rose-600"
                        : prospect.credentials_status === "active"
                        ? "text-lime-300"
                        : "text-gray-900"
                    }>
                    {prospect.rfc}
                  </span>
                </Table.Cell>

                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {prospect.companyName}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {prospect.cellPhone}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {prospect.email}
                </Table.Cell>

                <Table.Cell align="right">
                  <div className="flex flex-col justify-end">
                    <Button
                      onClick={() => viewClient(prospect.uuid)}
                      className="">
                      Ver
                    </Button>
                    {prospect.satwsid === null && (
                      <>
                        <Link
                          legacyBehavior
                          href={`/credenciales/${prospect.uuid}`}
                          onClick={() => showProcesses(prospect.id)}>
                          <a className="pt-3 flex" target="_blank">
                            <FiLink className="w-5 h-5 mr-1" />
                            Toma de Credenciales
                          </a>
                        </Link>
                        <Link
                          legacyBehavior
                          href={`https://api.whatsapp.com/send?phone=${prospect.cellPhone}&text=Para ingresar sus credenciales ingrese al siguiente link \n\n ${process.env.NEXT_PUBLIC_URL}/credenciales/${prospect.uuid}`}>
                          <a className="pt-3 flex" target="_blank">
                            <FaWhatsapp className="w-5 h-5 mr-1" />
                            Enviar Whatsapp de Credenciales
                          </a>
                        </Link>
                      </>
                    )}
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
