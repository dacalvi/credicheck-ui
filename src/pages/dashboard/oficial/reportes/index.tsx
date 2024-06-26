import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Accordion, Spinner} from "flowbite-react";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {FiClock, FiCheck, FiMinus, FiTrash} from "react-icons/fi";

import {getColor} from "functions/colors";

import {Tooltip, PieChart, Pie, Cell, ResponsiveContainer} from "recharts";
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
  const [loading, setLoading] = useState(false);

  const colors = [
    getColor("green-500"),
    getColor("yellow-500"),
    getColor("red-500"),
  ];

  const [processes, setProcesses] = useState<Process[]>([]);

  async function calculateScoreSum(process: Process) {
    let sum = 0;
    process.steps.forEach((step) => {
      sum += step.score;
    });
    process.score = sum;
  }

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

  const loadProcessCall = useCallback(async () => {
    const response = await fetch("/api/processes");
    const data = await response.json();

    //enrich the data.processes with the scoreSum and set it to the score property of the process
    data.processes?.forEach((process: Process) => {
      calculateScoreSum(process);
      getPieDataByResult(process);
    });

    setProcesses(data.processes);
  }, []);

  const loadProcesses = useCallback(async () => {
    //set loading state to true
    setLoading(true);

    //load the processes
    await loadProcessCall();

    setLoading(false);
  }, [loadProcessCall]);

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadProcesses();
    }
  }, [loadProcessCall, loadProcesses, router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle
            title="Indicadores generales a lo largo del tiempo"
            subtitle="Indicadores Globales"
          />
        </div>

        <div></div>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Reportes" subtitle="Listar Reportes" />
        </div>
        <div>
          <button
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={() => router.push("/dashboard/oficial/reportes/crear")}>
            Crear Nuevo Reporte
          </button>
        </div>
      </div>
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
              <Link legacyBehavior href="/dashboard/oficial/reportes/crear">
                <a className="text-blue-500 hover:text-blue-700">
                  Crear Nuevo Reporte
                </a>
              </Link>
            </div>
          </div>
        ) : (
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
                      <Spinner color="info" aria-label="Info spinner example" />
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
                        <FiTrash
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProcess(process.id);
                          }}
                          size={15}
                          className="ml-2"
                          color="red"
                        />
                      </div>
                    </div>
                  </span>
                </Accordion.Title>
                <Accordion.Content>
                  <div className="flex flex-row w-full">
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
                                  value: process.groupCount?.manual || 0,
                                },
                                {
                                  name: "Rechazados",
                                  value: process.groupCount?.reject || 0,
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
                                  value: process.groupCount?.manual || 0,
                                },
                                {
                                  name: "Rechazados",
                                  value: process.groupCount?.reject || 0,
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
                          <div className="flex flex-row flex-wrap" key={index}>
                            <div className="">
                              <FrontIndicator step={step} index={index} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
        )}
      </Widget>
    </>
  );
};
export default Index;
