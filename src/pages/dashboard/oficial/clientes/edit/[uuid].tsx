import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Spinner} from "flowbite-react";

type Client = {
  id: number;
  rfc: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  email: string;
  ownerId: number;
  uuid: string;

  companyName: string;
  owner: {
    id: number;
  };
  credentials_status: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [client, setClient] = useState<Client>();

  const [loading, setLoading] = useState<boolean>(false);

  const loadClient = async () => {
    setLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/prospects/uuid/" + router.query.uuid
    );
    const data = await response.json();
    setClient(data.user);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
    if (router.query.uuid && status === "authenticated") {
      loadClient();
    }
  }, [router.query.uuid, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle
            title="Informacion del Cliente"
            subtitle={client?.companyName}
          />
        </div>
        <div></div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Cargando Cache" />
          <div className="ml-2 mt-1">Cargando Cliente</div>
        </div>
      ) : (
        <div>{client?.companyName}</div>
      )}
    </>
  );
};
export default Index;
