import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Spinner, Table} from "flowbite-react";
import {User} from "next-auth";
import SectionTitle from "components/section-title";

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSomething = async () => {
    setLoading(true);
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/agents");
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadSomething();
    }
  }, [router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Plantilla" subtitle="Plantilla" />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/supervisor/agentes/crear")}>
            Crear
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Info spinner example" />
          <div className="ml-2 mt-1">Cargando Informacion</div>
        </div>
      ) : (
        <div>Plantilla</div>
      )}
    </>
  );
};
export default Index;
