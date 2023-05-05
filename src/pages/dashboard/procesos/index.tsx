import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Accordion, Spinner} from "flowbite-react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {FiClock, FiCheck, FiMinus} from "react-icons/fi";

type Process = {
  id: number;
  name: string;
  description: string;
  state: string;
  client: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //create a function to call api and get processes
  const [processes, setProcesses] = useState<Process[]>([]);

  const loadProcesses = async () => {
    //set loading state to true
    setLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/processes"
    );
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setProcesses(data.processes);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadProcesses();
    }
  }, [router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Procesos" subtitle="Listar Procesos" />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/procesos/crear")}>
            Crear Nuevo Proceso
          </button>
        </div>
      </div>
      <Widget>
        {loading ? (
          <div className="flex">
            <Spinner color="info" aria-label="Info spinner example" />
            <div className="ml-2 mt-1">Cargando Procesos...</div>
          </div>
        ) : processes.length === 0 ? (
          <div className="flex justify-center">
            <div className="text-gray-500">
              No hay procesos de análisis iniciados todavía.
              <br></br>
              <Link href="/dashboard/procesos/crear">
                <a className="text-blue-500 hover:text-blue-700">
                  Crear Nuevo Proceso
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <Accordion>
            {processes.map((process, index) => (
              <Accordion.Panel key={index}>
                <Accordion.Title>
                  <span className="flex">
                    {process.state === "PENDING" ? (
                      <FiClock size={22} className=" mb-1 ml-1" color="gray" />
                    ) : null}

                    {process.state === "IN_PROGRESS" ? (
                      <Spinner color="info" aria-label="Info spinner example" />
                    ) : null}

                    {process.state === "FINISHED" ? (
                      <FiCheck
                        size={22}
                        className="mt-1 mb-1 ml-1"
                        color="green"
                      />
                    ) : null}

                    {process.state === "CANCELLED" ? (
                      <FiMinus
                        size={22}
                        className="mt-1 mb-1 ml-1"
                        color="gray"
                      />
                    ) : null}

                    <div className="ml-3 mt-1">
                      # {process.id} - {process.name}
                    </div>
                  </span>
                </Accordion.Title>
                <Accordion.Content>
                  <div className="w-full">Content goes here</div>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        )}
      </Widget>
    </>
  );
};
export default Index;
