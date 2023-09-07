import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Spinner, Table} from "flowbite-react";

type CacheEntry = {
  id: number;
  url: string;
  method: string;
  headers: string;
  result: string;
  createdAt: string;
  updatedAt: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCacheEntries = async () => {
    setLoading(true);
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/cache");
    const data = await response.json();
    setCacheEntries(data.cacheEntries);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadCacheEntries();
    }
  }, [router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle
            title="Consultas a las fuentes de datos"
            subtitle="Cache"
          />
        </div>
        <div></div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Cargando Cache" />
          <div className="ml-2 mt-1">Cargando Elementos del Cache</div>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>URL</Table.HeadCell>
            <Table.HeadCell>Metodo</Table.HeadCell>
            <Table.HeadCell>Headers</Table.HeadCell>
            <Table.HeadCell>Resultado</Table.HeadCell>
            <Table.HeadCell>Fecha de Creación</Table.HeadCell>
            <Table.HeadCell>Fecha de Actualización</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {cacheEntries.map((company) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{company.url}</Table.Cell>
                <Table.Cell>{company.method}</Table.Cell>
                <Table.Cell>{company.headers}</Table.Cell>
                <Table.Cell>{company.result}</Table.Cell>
                <Table.Cell>{company.createdAt}</Table.Cell>
                <Table.Cell>{company.updatedAt}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  );
};
export default Index;
