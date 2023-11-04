import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {Accordion, Spinner, Tooltip} from "flowbite-react";

import Widget from "components/widget";
import {Badge} from "components/badges";
import {
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiFastForward,
  FiMinus,
  FiPause,
  FiRefreshCw,
  FiStopCircle,
  FiTrash,
} from "react-icons/fi";
import Link from "next/link";
import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";
import {getColor} from "functions/colors";
import {FrontIndicator} from "components/indicators/FrontIndicator";

type Step = {
  id: number;
  name: string;
  description: string;
  order: number;
  state: string;
  result: string;
  score: number;
  resultExplanation?: string;
};

type Process = {
  id: number;
  name: string;
  description: string;
  state: string;
  steps: Step[];
  score?: number;
  groupCount?: {
    [key: string]: number;
  };
  client: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
};

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

export type CustomTooltipProps = {
  active?: boolean;
  payload?: any;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({active, payload}) => {
  if (active && payload && payload.length) {
    const {name, value} = payload[0].payload;
    return (
      <div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white shadow-lg rounded-lg p-2 text-xs">
        <div>
          <span className="font-bold">{name}:</span>{" "}
          <span className="font-normal">{value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [client, setClient] = useState<Client>();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingExtractions, setLoadingExtractions] = useState<boolean>(false);
  const [extractions, setExtractions] = useState<any[]>([]);

  const colors = [
    getColor("green-500"),
    getColor("yellow-500"),
    getColor("red-500"),
  ];

  async function calculateScoreSum(process: Process) {
    let sum = 0;
    process.steps.forEach((step) => {
      sum += step.score;
    });
    process.score = sum;
  }

  const [processes, setProcesses] = useState<Process[]>([]);

  async function getPieDataByResult(process: Process) {
    let skip = 0;
    let reject = 0;
    let manual = 0;

    process.steps.forEach((step) => {
      if (step.result === "SKIP") {
        skip++;
      } else if (step.result === "REJECT") {
        reject++;
      } else if (step.result === "MANUAL") {
        manual++;
      }
    });
    process.groupCount = {
      skip,
      reject,
      manual,
    };
  }

  const loadProcessCall = useCallback(
    async (uuid: string | string[] | undefined = "") => {
      if (uuid === "") {
        uuid = router.query.uuid;
      }
      const response = await fetch(`/api/processes/client/${uuid}`);
      const data = await response.json();

      //enrich the data.processes with the scoreSum and set it to the score property of the process
      data.processes?.forEach((process: Process) => {
        calculateScoreSum(process);
        getPieDataByResult(process);
      });

      setProcesses(data.processes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const deleteProcess = async (id: number) => {
    const confirm = window.confirm(
      "¿Estás seguro que deseas eliminar este reporte?"
    );
    if (confirm) {
      //delete the process
      const response = await fetch("/api/processes/" + id, {
        method: "DELETE",
      });
      await response.json();
      //reload the processes
      await loadProcessCall();
    }

    //reload the processes
    await loadProcessCall();
  };

  const loadClient = async () => {
    setLoading(true);
    const response = await fetch("/api/prospects/uuid/" + router.query.uuid);
    const data = await response.json();
    setClient(data.user);
    setLoading(false);
  };

  const loadExtractions = async () => {
    setLoadingExtractions(true);
    const response = await fetch("/api/extractions/user/" + router.query.uuid);
    const data = await response.json();
    setExtractions(data.extractions);
    setLoadingExtractions(false);
  };

  const refreshExtractions = async () => {
    setLoadingExtractions(true);
    const response = await fetch("/api/extractions/list/" + router.query.uuid);
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
      loadProcessCall(router.query.uuid);
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
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div>
              <Widget
                title="SAT"
                description={<span>Credenciales</span>}
                className="h-40">
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
          <div>
            <Widget>
              {loading ? (
                <div className="flex justify-center">
                  <div className="text-gray-500 w-full text-center p-5">
                    <Spinner color="info" aria-label="Info spinner example" />
                    <div className="ml-2 mt-1">Cargando Reportes...</div>
                  </div>
                </div>
              ) : processes?.length === 0 ? (
                <div className="flex justify-center">
                  <div className="text-gray-500 w-full text-center p-5">
                    No hay reportes de análisis iniciados todavía.
                    <br></br>
                    <Link
                      legacyBehavior
                      href="/dashboard/oficial/reportes/crear">
                      <a className="text-blue-500 hover:text-blue-700">
                        Crear Nuevo Reporte
                      </a>
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <Accordion>
                    {processes?.map((process, index) => (
                      <Accordion.Panel key={index}>
                        <Accordion.Title>
                          <span className="flex">
                            {process.state === "PENDING" ? (
                              <FiClock
                                size={22}
                                className=" mb-1 ml-1"
                                color="gray"
                                title="Pendiente"
                              />
                            ) : null}

                            {process.state === "IN_PROGRESS" ? (
                              <Spinner
                                color="info"
                                aria-label="Info spinner example"
                              />
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
                              <div className="flex">
                                #{process.id} {process.client.firstName}{" "}
                                {process.client.lastName} - {process.name}
                              </div>
                            </div>
                          </span>
                        </Accordion.Title>
                        <Accordion.Content>
                          <div className="flex flex-row justify-between w-full">
                            <div className="w-28">
                              <div style={{width: 80}}>
                                <ResponsiveContainer height={80} width={80}>
                                  <PieChart>
                                    <Pie
                                      outerRadius={30}
                                      data={[
                                        {
                                          name: "Aprobados",
                                          value: process.groupCount?.skip || 0,
                                        },
                                        {
                                          name: "Revision",
                                          value:
                                            process.groupCount?.manual || 0,
                                        },
                                        {
                                          name: "Rechazados",
                                          value:
                                            process.groupCount?.reject || 0,
                                        },
                                      ]}
                                      //cx={200}
                                      //cy={200}
                                      //startAngle={180}
                                      //endAngle={0}
                                      innerRadius={20}
                                      fill="#8884d8"
                                      dataKey="value">
                                      {[
                                        {
                                          name: "Aprobados",
                                          value: process.groupCount?.skip || 0,
                                        },
                                        {
                                          name: "Revision",
                                          value:
                                            process.groupCount?.manual || 0,
                                        },
                                        {
                                          name: "Rechazados",
                                          value:
                                            process.groupCount?.reject || 0,
                                        },
                                      ].map((entry, index) => {
                                        return (
                                          <Cell
                                            key={entry.name}
                                            fill={colors[index % colors.length]}
                                          />
                                        );
                                      })}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                  </PieChart>
                                </ResponsiveContainer>

                                <div className="font-bold text-xl pl-1 text-center w-20">
                                  SCORE <br />
                                  {process.score}
                                </div>
                              </div>
                            </div>
                            <div className="w-3/4 ">
                              <div className="flex flex-row flex-wrap">
                                {process.steps.map((step, index) => (
                                  <div
                                    className="flex flex-row flex-wrap"
                                    key={index}>
                                    <div className="">
                                      <FrontIndicator
                                        step={step}
                                        index={index}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-end w-6">
                              <FiTrash
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProcess(process.id);
                                }}
                                size={15}
                                className="ml-2 cursor-pointer"
                                color="red"
                              />
                            </div>
                          </div>
                        </Accordion.Content>
                      </Accordion.Panel>
                    ))}
                  </Accordion>
                  {processes?.length > 0 && (
                    <div className="flex justify-center">
                      <div className="text-gray-500 w-full text-center p-5">
                        <Link
                          legacyBehavior
                          href="/dashboard/oficial/reportes/crear">
                          <a className="text-blue-500 hover:text-blue-700">
                            Crear Nuevo Reporte
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Widget>
          </div>
        </div>
      )}
    </>
  );
};
export default Index;
