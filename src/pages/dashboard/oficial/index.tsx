import Section from "components/dashboard/section";
import SectionTitle from "components/dashboard/section-title";
import {FiActivity, FiUsers} from "react-icons/fi";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {ProgressBar} from "components/progress-bars";
import {Spinner} from "flowbite-react";

export type WidgetProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  right?: React.ReactNode;
};

type Step = {
  id: number;
  name: string;
  description: string;
  order: number;
  state: string;
  result: string;
  score: number;
  resultExplanation?: string;
};

type Process = {
  id: number;
  name: string;
  description: string;
  state: string;
  steps: Step[];
  score?: number;
  groupCount?: {
    [key: string]: number;
  };
  client: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
};

const Index: React.FC = () => {
  const {status, data} = useSession();
  const router = useRouter();
  const [prospectsCount, setProspectsCount] = useState(0);
  const [processesCount, setProcessesCount] = useState(0);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loadingProcesses, setLoadingProcesses] = useState(false);
  const [loadingProspectsCount, setLoadingProspectsCount] = useState(false);
  const [loadingProcessesCount, setLoadingProcessesCount] = useState(false);

  const loadProcesses = async () => {
    setLoadingProcesses(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/processes");
    const {processes} = await res.json();
    setProcesses(processes);
    setLoadingProcesses(false);
  };

  const getProspectsCount = async () => {
    setLoadingProspectsCount(true);
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/prospects/count"
    );
    const {prospectsCount} = await res.json();
    setProspectsCount(prospectsCount);
    setLoadingProspectsCount(false);
  };

  const getProcessesCount = async () => {
    setLoadingProcessesCount(true);
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/processes/count"
    );
    const {processesCount} = await res.json();
    setProcessesCount(processesCount);
    setLoadingProcessesCount(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadProcesses();
      getProspectsCount();
      getProcessesCount();
    }
  }, [data, router, status]);

  return (
    <>
      <SectionTitle title="Oficial de negocio" subtitle="Tablero inicial" />

      <div className="flex  flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-1/4">
          <div className="w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <div className="text-xs font-light text-gray-500 uppercase">
                  Clientes
                </div>
                {loadingProspectsCount ? (
                  <Spinner color="info" aria-label="Info spinner example" />
                ) : (
                  <div className="text-xl font-bold">
                    <Link href="/dashboard/clientes">
                      <a>{Number(prospectsCount)}</a>
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/dashboard/clientes/crear">
                <a>
                  <FiUsers size={24} className="text-gray-500 stroke-current" />
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <div className="w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <div className="text-xs font-light text-gray-500 uppercase">
                  Reportes
                </div>
                <div className="text-xl font-bold">
                  {loadingProcessesCount ? (
                    <Spinner color="info" aria-label="Info spinner example" />
                  ) : (
                    <Link href="/dashboard/reportes">
                      <a>{Number(processesCount)}</a>
                    </Link>
                  )}
                </div>
              </div>
              <Link href="/dashboard/reportes/crear">
                <a>
                  <FiActivity
                    size={24}
                    className="text-gray-500 stroke-current"
                  />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mb-2 lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <Section
          title="Reportes"
          description={<span>Listado de Reportes</span>}>
          <div className="flex flex-col w-full">
            <div className="overflow-x-scroll lg:overflow-hidden">
              {loadingProcesses ? (
                <div className="flex w-full text-center p-5">
                  <Spinner color="info" aria-label="Info spinner example" />
                  <div className="ml-2 mt-1">Cargando Reportes...</div>
                </div>
              ) : (
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-xs font-medium tracking-wider uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
                        Cliente
                      </th>
                      <th className="px-3 py-2 text-xs font-medium tracking-wider uppercase border-b border-gray-100 dark:border-gray-800 leading-4">
                        Progreso
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes?.map((process, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                          <span className="ml-2">
                            {process.client.firstName} {process.client.lastName}
                          </span>
                        </td>

                        <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                          <div className="flex flex-col w-full">
                            <div className="flex flex-row items-center justify-around">
                              <ProgressBar width={50} color={"bg-purple-500"} />
                              <span className="ml-1 text-gray-500">{50}%</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};
export default Index;
