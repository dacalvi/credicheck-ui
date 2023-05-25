import SectionTitle from "components/dashboard/section-title";
import {FiHome} from "react-icons/fi";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Spinner} from "flowbite-react";
import Link from "next/link";

const Index: React.FC = () => {
  const {status, data} = useSession();
  const router = useRouter();
  const [loadingCompaniesCount, setLoadingCompaniesCount] = useState(false);
  const [companiesCount, setCompaniesCount] = useState(0);

  const getCompaniesCount = async () => {
    setLoadingCompaniesCount(true);
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/companies/count"
    );
    const {companiesCount} = await res.json();
    setCompaniesCount(companiesCount);
    setLoadingCompaniesCount(false);
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
      </div>
    </>
  );
};
export default Index;
