import SectionTitle from "components/dashboard/section-title";
import {FiActivity, FiHome, FiUsers} from "react-icons/fi";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Spinner} from "flowbite-react";
import Link from "next/link";

const Index: React.FC = () => {
  const {status, data} = useSession();
  const router = useRouter();
  const [loadingCompaniesCount, setLoadingCompaniesCount] = useState(false);
  const [loadingProcessCount, setLoadingProcessCount] = useState(false);
  const [loadingUsersCount, setLoadingUsersCount] = useState(false);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [processesCount, setprocessesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  const getCompaniesCount = async () => {
    setLoadingCompaniesCount(true);
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/companies/count"
    );
    const {companiesCount} = await res.json();
    setCompaniesCount(companiesCount);
    setLoadingCompaniesCount(false);
  };

  const getProcessCount = async () => {
    setLoadingProcessCount(true);
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/processes/count"
    );
    const {processesCount} = await res.json();
    setprocessesCount(processesCount);
    setLoadingProcessCount(false);
  };

  const getUsersCount = async () => {
    setLoadingUsersCount(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/count");
    const {usersCount} = await res.json();
    setUsersCount(usersCount);
    setLoadingUsersCount(false);
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      getCompaniesCount();
      getProcessCount();
      getUsersCount();
    }
  }, [router, status]);

  return (
    <>
      <SectionTitle title="Overview" subtitle="Dashboard" />
      <div className="flex flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-1/4">
          <div className="w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <div className="text-xs font-light text-gray-500 uppercase">
                  Empresas
                </div>
                {loadingCompaniesCount ? (
                  <Spinner color="info" aria-label="Info spinner example" />
                ) : (
                  <div className="text-xl font-bold">
                    <Link href="/dashboard/empresas">
                      <a>{Number(companiesCount)}</a>
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/dashboard/empresas/crear">
                <a>
                  <FiHome size={24} className="text-gray-500 stroke-current" />
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
                {loadingProcessCount ? (
                  <Spinner color="info" aria-label="Info spinner example" />
                ) : (
                  <div className="text-xl font-bold">
                    <a>{Number(processesCount)}</a>
                  </div>
                )}
              </div>
              <a>
                <FiActivity
                  size={24}
                  className="text-gray-500 stroke-current"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4">
          <div className="w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <div className="text-xs font-light text-gray-500 uppercase">
                  Usuarios
                </div>
                {loadingUsersCount ? (
                  <Spinner color="info" aria-label="Info spinner example" />
                ) : (
                  <div className="text-xl font-bold">
                    <Link href="/dashboard/usuarios">
                      <a>{Number(usersCount)}</a>
                    </Link>
                  </div>
                )}
              </div>
              <a>
                <Link href="/dashboard/usuarios/crear">
                  <a>
                    <FiUsers
                      size={24}
                      className="text-gray-500 stroke-current"
                    />
                  </a>
                </Link>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Index;
