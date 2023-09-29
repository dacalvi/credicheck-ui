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
  FiRefreshCw,
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
  const [loadingExtractions, setLoadingExtractions] = useState<boolean>(false);
  const [extractions, setExtractions] = useState<any[]>([]);

  const loadClient = async () => {
    setLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/prospects/uuid/" + router.query.uuid
    );
    const data = await response.json();
    setClient(data.user);
    setLoading(false);
  };

  const loadExtractions = async () => {
    setLoadingExtractions(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/extractions/user/" + router.query.uuid
    );
    const data = await response.json();
    setExtractions(data.extractions);
    setLoadingExtractions(false);
  };

  const refreshExtractions = async () => {
    setLoadingExtractions(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/extractions/list/" + router.query.uuid
    );
    const data = await response.json();
    setExtractions(data.extractions);
    setLoadingExtractions(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
    if (router.query.uuid && status === "authenticated") {
      loadClient();
      loadExtractions();
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

                  {client?.credentials_status === "invalid" && (
                    <Badge
                      size="sm"
                      color={"bg-pink-700 text-pink-100"}
                      rounded>
                      Invalidas
                    </Badge>
                  )}

                  {client?.credentials_status === "deactivated" && (
                    <Badge
                      classNames="my-1"
                      size="sm"
                      color={"bg-pink-700 text-pink-100"}
                      rounded>
                      Desactivadas
                    </Badge>
                  )}

                  {client?.credentials_status === "error" && (
                    <Badge
                      classNames="my-1"
                      size="sm"
                      color={"bg-pink-700 text-pink-100"}
                      rounded>
                      Error
                    </Badge>
                  )}

                  {client?.credentials_status === "active" && (
                    <Badge size="sm" color={"bg-green-500 text-white"} rounded>
                      Activas
                    </Badge>
                  )}

                  {client?.credentials_status === "valid" && (
                    <Badge size="sm" color={"bg-green-500 text-white"} rounded>
                      Validas
                    </Badge>
                  )}
                </div>
              </Widget>
            </div>
            <div className="mx-3">
              <Widget
                title="Extracciones"
                description={
                  <span className="flex flex-row">
                    Extracciones en curso{" "}
                    <FiRefreshCw
                      className="ml-3"
                      onClick={() => {
                        refreshExtractions();
                      }}
                    />{" "}
                  </span>
                }>
                <div>
                  {loadingExtractions && (
                    <div className="flex">
                      <Spinner color="info" aria-label="Cargando Cache" />
                      <div className="ml-2 mt-1">Cargando Extracciones</div>
                    </div>
                  )}

                  {!loadingExtractions &&
                    extractions &&
                    extractions.length === 0 && (
                      <div className="flex">
                        <div className="ml-2 mt-1">No hay extracciones</div>
                      </div>
                    )}

                  {!loadingExtractions &&
                    extractions &&
                    extractions.length > 0 &&
                    extractions?.map(
                      (extraction) =>
                        extraction.status === "pending" && (
                          <Badge
                            size="sm"
                            color={"bg-amber-200 text-black"}
                            rounded
                            classNames="mx-1 my-1">
                            <FiClock size={14} className="mr-1 my-1" />
                            <span className="my-1">{extraction.extractor}</span>
                          </Badge>
                        )
                    )}

                  {!loadingExtractions &&
                    extractions &&
                    extractions.length > 0 &&
                    extractions?.map(
                      (extraction) =>
                        extraction.status === "running" && (
                          <Badge
                            size="sm"
                            color={"bg-blue-700 text-white"}
                            rounded
                            classNames="mx-1 my-1">
                            <FiFastForward
                              size={14}
                              className="mr-1 my-1 text-white"
                            />
                            <span className="my-1">{extraction.extractor}</span>
                          </Badge>
                        )
                    )}

                  {!loadingExtractions &&
                    extractions &&
                    extractions.length > 0 &&
                    extractions?.map(
                      (extraction) =>
                        extraction.status === "finished" && (
                          <Badge
                            size="sm"
                            color={"bg-emerald-400  text-black"}
                            rounded
                            classNames="mx-1 my-1">
                            <FiCheck
                              color="black"
                              size={14}
                              className="mr-1 my-1 text-white"
                            />
                            <span className="my-1">{extraction.extractor}</span>
                          </Badge>
                        )
                    )}

                  {!loadingExtractions &&
                    extractions &&
                    extractions.length > 0 &&
                    extractions?.map(
                      (extraction) =>
                        extraction.status === "failed" && (
                          <Badge
                            size="sm"
                            color={"bg-red-700 text-white"}
                            rounded
                            classNames="mx-1 my-1">
                            <FiPause
                              size={14}
                              className="mr-1 my-1 text-white"
                            />
                            <span className="my-1">{extraction.extractor}</span>
                          </Badge>
                        )
                    )}

                  {!loadingExtractions &&
                    extractions &&
                    extractions.length > 0 &&
                    extractions?.map(
                      (extraction) =>
                        extraction.status === "stopping" && (
                          <Badge
                            size="sm"
                            color={"bg-amber-200 text-black"}
                            rounded
                            classNames="mx-1 my-1">
                            <FiStopCircle
                              size={14}
                              className="mr-1 my-1 text-white"
                            />
                            <span className="my-1">{extraction.extractor}</span>
                          </Badge>
                        )
                    )}

                  {!loadingExtractions &&
                    extractions &&
                    extractions.length > 0 &&
                    extractions?.map(
                      (extraction) =>
                        extraction.status === "stopped" && (
                          <Badge
                            size="sm"
                            color={"bg-gray-200 text-black"}
                            rounded
                            classNames="mx-1 my-1">
                            <FiAlertCircle
                              size={14}
                              className="mr-1 my-1 text-white"
                            />
                            <span className="my-1">{extraction.extractor}</span>
                          </Badge>
                        )
                    )}
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
