import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Table} from "flowbite-react";

type Company = {
  id: number;
  name: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);

  const loadCompanies = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/companies"
    );
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setCompanies(data.companies);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadCompanies();
    }
  }, [router, status]);

  const editCompany = async (id: number) => {
    router.push(`/dashboard/empresas/${id}/editar`);
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Empresas" subtitle="Lista de empresas" />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/empresas/crear")}>
            Crear Empresa
          </button>
        </div>
      </div>

      <Table>
        <Table.Head>
          <Table.HeadCell>Nombre</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Editar</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {companies.map((company) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {company.name}
              </Table.Cell>
              <Table.Cell align="right">
                <div className="flex flex-row justify-end">
                  <Button onClick={() => editCompany(company.id)} className="">
                    Editar
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
