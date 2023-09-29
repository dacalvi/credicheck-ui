import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Accordion, Button, Label, Spinner, TextInput} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Controller, FormProvider, useForm} from "react-hook-form";
import Indicator from "components/indicator";
import {IndicatorMultiRangeParameters} from "components/slider";
import {ErrorMessage} from "components/forms/error-message";
import {FiTrash2} from "react-icons/fi";
import {Result} from "constants/values";
type CheckedIndicator = {
  id: number;
  name: string;
  order: number;

  source: {
    id: number;
    name: string;
  };
  checked: boolean;
};

type IndicatorParameters = {
  id: number;
  name: string;
};

export type FormProps = {
  name: string;
};

interface YearsOfActivityParametersProps {
  onChange: (
    segments: number[],
    segmentsStatus: Result[],
    scores: number[]
  ) => any;
  rangesValues: number[];
  rangesStatus: Result[];
  rangesScores?: number[];
  defaultStatus?: Result;
  defaultScore?: number;
}

interface ResizableSliderSegmentEditorProps {
  index: number;
  onDelete?: any;
  onChange?: any;
  initialStatus?: Result;
  initialScore?: number;
  segments: number[];
  canDelete?: boolean;
}

const ResizableSliderSegmentEditor: React.FC<
  ResizableSliderSegmentEditorProps
> = ({
  index,
  onDelete,
  onChange,
  initialStatus,
  initialScore,
  segments,
  canDelete = true,
}) => {
  //crete a state called status with type Result
  const [status, setStatus] = useState<Result>(initialStatus || Result.REJECT);
  const [score, setScore] = useState<number>(initialScore || 0);

  const handleDelete = () => {
    onDelete(index);
  };

  useEffect(() => {
    onChange(index, status, score);
  }, [status, score]);

  return (
    <div>
      <div className="flex flex-row">
        {status === Result.REJECT && (
          <div className="h-24 w-1 mr-5 mt-3 bg-[#f00]"></div>
        )}
        {status === Result.MANUAL && (
          <div className="h-24 w-1 mr-5 mt-3 bg-[#fbff43]"></div>
        )}
        {status === Result.SKIP && (
          <div className="h-24 w-1 mr-5 mt-3 bg-[#0f0]"></div>
        )}
        <div className="flex flex-col">
          <div className="flex flex-row mt-2">
            <div className="flex flex-col mr-5">
              <Label htmlFor="test" value="Resultado" />
              <Button.Group id="3">
                <Button
                  size="xs"
                  color="red"
                  onClick={() => {
                    setStatus(Result.REJECT);
                  }}>
                  Rechazo
                </Button>
                <Button
                  size="xs"
                  color="yellow"
                  onClick={() => setStatus(Result.MANUAL)}>
                  Manual
                </Button>
                <Button
                  size="xs"
                  color="green"
                  onClick={() => setStatus(Result.SKIP)}>
                  Aprobar
                </Button>
              </Button.Group>
            </div>

            <div className="flex flex-col mr-5">
              <Label htmlFor="test" value="Score" />
              <TextInput
                name="test"
                type="text"
                sizing="sm"
                value={score}
                onChange={(e) => {
                  setScore(Number(e.target.value));
                  onChange();
                }}
              />
            </div>
            {canDelete && (
              <div>
                <FiTrash2
                  size={20}
                  className="mt-6 cursor-pointer"
                  onClick={() => {
                    handleDelete();
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-1 text-xs">
            {index < 1
              ? `Si la cantidad de años de actividad es menor a ${
                  segments[0]
                } el resultado va a ser ${
                  status === Result.REJECT
                    ? "Rechazo"
                    : status === Result.MANUAL
                    ? "Manual"
                    : "Aprobado"
                } con un score de ${score}`
              : ""}

            {index > 0 && index < segments.length
              ? `Si la cantidad de años de actividad es mayor a ${
                  segments[index - 1]
                } y menor a ${segments[index]}, el resultado sera de ${
                  status === Result.REJECT
                    ? "Rechazo"
                    : status === Result.MANUAL
                    ? "Manual"
                    : "Aprobado"
                } con un score de ${score}`
              : ""}

            {index === segments.length
              ? `Si la cantidad de años de actividad es mayor a ${
                  segments[index - 1]
                }, el resultado sera de ${
                  status === Result.REJECT
                    ? "Rechazo"
                    : status === Result.MANUAL
                    ? "Manual"
                    : "Aprobado"
                } con un score de ${score}`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

const YearsOfActivityParameters: React.FC<YearsOfActivityParametersProps> = ({
  rangesValues,
  rangesStatus,
  onChange,
}) => {
  /*TODO: Sacar este useeffect */
  useEffect(() => {
    //console.log("rangesStatus", rangesStatus);
  }, [rangesStatus]);

  const [segments, setSegments] = useState<number[]>(rangesValues);
  const [segmentsStatus, setSegmentsStatus] = useState<Result[]>(rangesStatus);
  const [scores, setScores] = useState<number[]>([]);

  useEffect(() => {
    onChange(segments, segmentsStatus, scores);
  }, [segments, segmentsStatus, scores]);

  const addSegment = () => {
    //add a segment to the segments, the added segment should be the last segment plus 1
    const lastSegment = segments[segments.length - 1];
    setSegments([...segments, lastSegment + 1]);
    setSegmentsStatus([...segmentsStatus, Result.REJECT]);
  };

  const deleteSegment = (index: number) => {
    if (segments.length > 1) {
      //remove the element from the segments array at the index position
      setSegments(segments.filter((_, i) => i !== index));
      setSegmentsStatus(segmentsStatus.filter((_, i) => i !== index));
    } else {
      alert("No se puede eliminar el ultimo segmento");
    }
  };

  return (
    <div>
      <IndicatorMultiRangeParameters
        min={0}
        max={40}
        rangesValues={segments}
        rangeStates={segmentsStatus}
        onChange={(newsegments) => {
          if (typeof newsegments === "number") {
            newsegments = [newsegments];
          }
          setSegments(newsegments);
          onChange(newsegments, segmentsStatus, scores);
        }}
      />

      <div className="mt-5">
        {
          // eslint-disable-next-line react/no-array-index-key
          segments.map((segment, index) => (
            <ResizableSliderSegmentEditor
              key={index}
              index={index}
              onDelete={deleteSegment}
              canDelete={segments.length > 1}
              onChange={(index: any, status: any, score: any) => {
                const newSegmentsStatus = [...segmentsStatus];
                newSegmentsStatus[index] = status;
                setSegmentsStatus(newSegmentsStatus);
              }}
              segments={segments}
            />
          ))
        }

        <ResizableSliderSegmentEditor
          key={segments.length}
          index={segments.length}
          onDelete={deleteSegment}
          canDelete={segments.length > 1}
          onChange={(index: any, status: any, score: any) => {
            const newSegmentsStatus = [...segmentsStatus];
            newSegmentsStatus[index] = status;
            setSegmentsStatus(newSegmentsStatus);
          }}
          segments={segments}
        />
      </div>

      <div className="mt-5">
        <Label
          htmlFor="test"
          value="Opcion por defecto si no encaja en ningun segmento"
        />

        <div className="flex flex-row">
          <div className="h-20 w-1 mr-5 mt-3 mb-3 bg-[#ddd]"></div>
          <div className="flex flex-row mt-2">
            <div className="flex flex-col mr-5">
              <Label htmlFor="test" value="Resultado" />
              <Button.Group id="1">
                <Button size="xs" color="red">
                  Rechazo
                </Button>
                <Button size="xs" color="yellow">
                  Manual
                </Button>
                <Button size="xs" color="green">
                  Aprobar
                </Button>
              </Button.Group>
            </div>

            <div className="flex flex-col mr-5">
              <Label htmlFor="test" value="Score" />
              <TextInput name="test" type="text" sizing="sm" />
            </div>
          </div>
        </div>
      </div>

      <Button size="xs" onClick={addSegment}>
        Agregar un segmento
      </Button>
    </div>
  );
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [indicators, setIndicators] = useState<CheckedIndicator[]>([]);
  const [checkedIndicators, setCheckedIndicators] = useState<
    IndicatorParameters[]
  >([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadIndicators();
    }
  }, [router, status]);

  const methods = useForm<FormProps>({
    defaultValues: {
      name: "",
    },
  });
  const {
    handleSubmit,
    formState: {errors},
    control,
  } = methods;

  const loadIndicators = async () => {
    setLoadingIndicators(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/indicators"
    );
    const data = await response.json();
    setIndicators(data.indicators?.indicators);
    setLoadingIndicators(false);
  };

  const onSubmit = async (data: any) => {
    setSaveLoading(true);
    // eslint-disable-next-line no-console
    console.log(data, checkedIndicators);
    /* 
    try {
      setLoading(true);
      const fetchResponse = (await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/templates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )) as any;

      const response = await fetchResponse.json();

      // eslint-disable-next-line no-console
      console.log(response);
      setLoading(false);
      router.push("/dashboard/clientes");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    */
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <SectionTitle title="Plantilla" subtitle="Nueva Plantilla" />

          <div className="flex flex-row">
            <div className="w-2/4">
              {/* Nombre de la plantilla */}
              <Widget
                title="Agrupar indicadores en una plantilla"
                description="">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="name" value="Nombre de la plantilla" />
                  </div>
                  <Controller
                    name="name"
                    control={control}
                    render={({field}) => (
                      <TextInput
                        id="name"
                        type="text"
                        placeholder="Escriba un nombre descriptivo para la plantilla. Ej: Credito de consumo"
                        required={true}
                        {...field}
                      />
                    )}
                  />
                  {errors?.name?.message && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                  )}
                </div>
              </Widget>

              {/* Indicadores */}
              <Widget title="Indicaodres disponibles" description="">
                {loadingIndicators ? (
                  <div className="flex">
                    <Spinner color="info" aria-label="Info spinner example" />
                    <div className="ml-2 mt-1">Cargando Indicadores</div>
                  </div>
                ) : (
                  <div className="flex flex-row flex-wrap">
                    {indicators &&
                      indicators.map((indicator) => (
                        <Indicator
                          id={indicator.id}
                          key={indicator.id}
                          title={indicator.source.name}
                          description={indicator.name}
                          isChecked={indicator.checked}
                          onChange={(id, checked) => {
                            // update checked indicators
                            if (checked) {
                              setCheckedIndicators([
                                ...checkedIndicators,
                                {
                                  id: indicator.id,
                                  name: indicator.name,
                                },
                              ]);
                            } else {
                              setCheckedIndicators(
                                checkedIndicators.filter(
                                  (item) => item.id !== indicator.id
                                )
                              );
                            }
                          }}
                        />
                      ))}
                  </div>
                )}
              </Widget>
            </div>
            <div className="w-2/4 ml-5">
              {/* Parametros */}
              <Widget title="Parametros" description="">
                {checkedIndicators.length > 0 ? (
                  <Accordion collapseAll={true}>
                    {checkedIndicators.map((indicator) => (
                      <Accordion.Panel key={indicator.id}>
                        <Accordion.Title>{indicator.name}</Accordion.Title>
                        <Accordion.Content>
                          {(() => {
                            switch (indicator.id) {
                              case 4:
                                return (
                                  /* TODO: Traer desde base de datos o configuracion valores por defecto */
                                  <YearsOfActivityParameters
                                    rangesValues={[10, 20, 30]}
                                    rangesStatus={[
                                      Result.REJECT,
                                      Result.MANUAL,
                                      Result.SKIP,
                                      Result.REJECT,
                                    ]}
                                    onChange={(value) => {
                                      // eslint-disable-next-line no-console
                                      console.log(value);
                                    }}
                                  />
                                );
                              default:
                                return null;
                            }
                          })()}
                        </Accordion.Content>
                      </Accordion.Panel>
                    ))}
                  </Accordion>
                ) : (
                  <div className="flex flex-col">
                    <div className="text-gray-500 text-center">
                      No hay indicadores seleccionados
                    </div>
                  </div>
                )}
              </Widget>

              {/* Boton Guardar */}
              <Widget title="" description="">
                <div className="mt-4">
                  <Button
                    disabled={saveLoading || loadingIndicators}
                    type="submit">
                    {saveLoading && (
                      <Spinner aria-label="Spinner button example" />
                    )}
                    <span className={saveLoading ? "pl-3" : ""}>
                      {saveLoading ? "Guardando...." : "Guardar"}
                    </span>
                  </Button>
                </div>
              </Widget>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default Index;
