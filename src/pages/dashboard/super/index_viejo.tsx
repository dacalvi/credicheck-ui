import Widget1 from "components/dashboard/widget-1";
import SectionTitle from "components/dashboard/section-title";
import {FiActivity, FiUsers} from "react-icons/fi";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {Spinner} from "flowbite-react";

const Index: React.FC = () => {
  const {status, data} = useSession();
  const router = useRouter();

  const [processesCount, setProcessesCount] = useState(0);
  const [loadingProcessesCount, setLoadingProcessesCount] = useState(false);

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
    // eslint-disable-next-line no-console
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      getProcessesCount();
    }
  }, [router, status]);

  return (
    <>
      <SectionTitle title="Supervisor" subtitle="Tablero inicial" />

      <div className="flex flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Prospectos"
            description={588}
            right={
              <FiUsers size={24} className="text-gray-500 stroke-current" />
            }
          />
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
                    <Link legacyBehavior href="/dashboard/reportes">
                      <a>{Number(processesCount)}</a>
                    </Link>
                  )}
                </div>
              </div>
              <Link legacyBehavior href="/dashboard/reportes/crear">
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
    </>
  );
};
export default Index;
