import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Spinner} from "flowbite-react";

import Widget from "components/widget";
import {Badge} from "components/badges";
import {
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiFastForward,
  FiPause,
  FiStopCircle,
} from "react-icons/fi";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div>
          <div className="flex flex-row">
            <div>
              <Widget title="SAT" description={<span>Credenciales</span>}>
                <div className="mx-3">
                  {client?.credentials_status === "pending" && (
                    <Badge
                      size="sm"
                      color={"bg-pink-700 text-pink-100"}
                      rounded>
                      Pendientes
                    </Badge>
                  )}

                  {client?.credentials_status === "active" && (
                    <Badge size="sm" color={"bg-green-500 text-white"} rounded>
                      Activas
                    </Badge>
                  )}
                </div>
              </Widget>
            </div>
            <div className="mx-3">
              <Widget
                title="Extracciones"
                description={<span>Extracciones en curso</span>}>
                <div>
                  <Badge
                    size="sm"
                    color={"bg-amber-200 text-black"}
                    rounded
                    classNames="mx-1">
                    <FiClock size={14} className="mr-1 my-1" />
                    <span className="my-1">pending</span>
                  </Badge>
                  <Badge
                    size="sm"
                    color={"bg-blue-700 text-white"}
                    rounded
                    classNames="mx-1">
                    <FiFastForward size={14} className="mr-1 my-1 text-white" />
                    <span className="my-1">running</span>
                  </Badge>

                  <Badge
                    size="sm"
                    color={"bg-emerald-400  text-black"}
                    rounded
                    classNames="mx-1">
                    <FiCheck size={14} className="mr-1 my-1" />
                    <span className="my-1">finished</span>
                  </Badge>

                  <Badge
                    size="sm"
                    color={"bg-red-700 text-white"}
                    rounded
                    classNames="mx-1">
                    <FiAlertCircle size={14} className="mr-1 my-1 text-white" />
                    <span className="my-1">failed</span>
                  </Badge>

                  <Badge
                    size="sm"
                    color={"bg-amber-200 text-black"}
                    rounded
                    classNames="mx-1">
                    <FiPause size={14} className="mr-1 my-1 text-black" />
                    <span className="my-1">stopping</span>
                  </Badge>

                  <Badge
                    size="sm"
                    color={"bg-gray-200 text-black"}
                    rounded
                    classNames="mx-1">
                    <FiStopCircle size={14} className="mr-1 my-1 text-black" />
                    <span className="my-1">stopped</span>
                  </Badge>
                </div>
              </Widget>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Index;
