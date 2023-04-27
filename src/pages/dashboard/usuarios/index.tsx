import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Table} from "flowbite-react";

export type FormProps = {
  email: string;
  password: string;
  roleId: number | null;
};

type User = {
  id: number;
  email: string;
  roleId: number;
  role: {
    name: string;
  };
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const response = await fetch("http://localhost:3000/api/users");
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setUsers(data.users);
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

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Usuarios" subtitle="Listar Usuarios" />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/usuarios/crear")}>
            Crear Usuario
          </button>
        </div>
      </div>

      <Table>
        <Table.Head>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Rol</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map((user) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {user.email}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {user.role.name}
              </Table.Cell>
              <Table.Cell align="right">
                <Button onClick={() => editUser(user.id)}>Editar</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
export default Index;