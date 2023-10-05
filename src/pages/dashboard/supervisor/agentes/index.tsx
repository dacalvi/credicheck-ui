import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Spinner, Table} from "flowbite-react";

type User = {
  firstName: string;
  lastName: string;
  id: number;
  email: string;
  roleId: number;
  role: {
    name: string;
  };
  company: {
    name: string;
  };
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const response = await fetch(process.env.VERCEL_URL + "/api/agents");
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
      loadUsers();
    }
  }, [router, status]);

  const editUser = async (id: number) => {
    router.push(`/dashboard/usuarios/${id}`);
  };

  const viewReports = async (id: number) => {
    router.push(`/dashboard/supervisor/agentes/${id}/reportes`);
  };

  const viewClients = async (id: number) => {
    router.push(`/dashboard/supervisor/agentes/${id}/clientes`);
  };

  const deleteUser = async (id: number) => {
    //prompt user to confirm
    const confirm = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (confirm) {
      setLoading(true);
      //delete the user
      const response = await fetch(
        process.env.VERCEL_URL + "/api/agents/" + id,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      // eslint-disable-next-line no-console
      console.log(data);
      //reload the users
      setLoading(false);
      loadUsers();
    }
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle
            title="Oficiales de Cuenta"
            subtitle="Listar Oficiales de Cuenta"
          />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/supervisor/agentes/crear")}>
            Crear Oficial de Cuentas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Info spinner example" />
          <div className="ml-2 mt-1">Cargando Usuarios</div>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>

            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users?.map((user, index) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={index}>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.email}
                </Table.Cell>
                <Table.Cell align="right" className="flex justify-end">
                  <Button onClick={() => viewClients(user.id)}>Clientes</Button>
                  <Button className="ml-5" onClick={() => viewReports(user.id)}>
                    Reportes
                  </Button>
                  <Button className="ml-5" onClick={() => editUser(user.id)}>
                    Editar
                  </Button>
                  <Button className="ml-5" onClick={() => deleteUser(user.id)}>
                    Borrar
                  </Button>
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
