import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Spinner, Table} from "flowbite-react";
import Link from "next/link";
import Moment from "react-moment";

type RequestLog = {
  uuid: string;
  url: string;
  method: string;
  headers: string;
  response: string;
  createdAt: string;
  updatedAt: string;
  servedFromCache: string;
  servedFromCacheUuid: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadRequestLogs = async () => {
    setLoading(true);
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/requests");
    const data = await response.json();
    setRequestLogs(data.requests);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadRequestLogs();
    }
  }, [router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle
            title="Solicitudes"
            subtitle="Listado de solicitudes realizadas al servidor."
          />
        </div>
        <div></div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Cargando Solicitudes" />
          <div className="ml-2 mt-1">Cargando solicitudes </div>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Metodo</Table.HeadCell>
            <Table.HeadCell>URL</Table.HeadCell>
            <Table.HeadCell>Fecha de Creación</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {requestLogs.map((request) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="w-40">
                  {request.method}{" "}
                  <Link
                    href={`/dashboard/super/cache/entry/${request.servedFromCacheUuid}`}>
                    {request.servedFromCache === "CHECKING" ? (
                      <small className="text-gray-500">(checking...)</small>
                    ) : (
                      ""
                    )}
                    {request.servedFromCache === "CACHE" ? (
                      <small className="text-green-500">(cache)</small>
                    ) : (
                      ""
                    )}

                    {request.servedFromCache === "SERVER" ? (
                      <small className="text-red-500">(from server)</small>
                    ) : (
                      ""
                    )}
                  </Link>
                </Table.Cell>
                <Table.Cell>{request.url}</Table.Cell>
                <Table.Cell>
                  <Moment locale="es" format="DD/MM/YYYY hh:mm:ss">
                    {request.createdAt}
                  </Moment>
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
