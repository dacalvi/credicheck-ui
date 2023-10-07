import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Accordion, Button, Label, Spinner, TextInput} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Controller, FormProvider, useForm} from "react-hook-form";
import Indicator from "components/indicator";
import {ErrorMessage} from "components/forms/error-message";
import {YearsOfActivityParameters} from "components/indicators/YearsOfActivityParameters";
/*

type IndicatorType = {
  id: number;
  name: string;
  order: number;
  source: {
    name: string;
  };
  sourceId: number;
  checked: boolean;
  associated_function: string;
  defaultConfig?: any;
  config?: any;
};

type IndicatorParameters = {
  id: number;
  name: string;
  order: number;
  source: any;
  sourceId: number;
  associated_function: string;
  defaultConfig: any;
  config?: any;
};
*/

export type FormProps = {
  name: string;
};

type IndicatorTemplate = {
  id: number;
  name: string;
  indicators: any[];
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [indicatorTemplate, setIndicatorTemplate] =
    useState<IndicatorTemplate | null>(null);

  /* Loaders */
  const [saveLoading, setSaveLoading] = useState(false);
  const [loadingIndicatorTemplate, setLoadingIndicatorTemplate] =
    useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      const fetchIndicators = async () => {
        await loadIndicatorTemplate(router.query.id as unknown as number);
      };
      fetchIndicators();
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
    setValue,
  } = methods;

  useEffect(() => {
    setValue("name", indicatorTemplate?.name || "");
  }, [indicatorTemplate, setValue]);

  const loadIndicatorTemplate = async (id: number) => {
    if (!id) return;
    setLoadingIndicatorTemplate(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/indicator_templates/${id}`
    );
    const data = await response.json();
    setIndicatorTemplate(data.indicatorTemplate);
    setLoadingIndicatorTemplate(false);
  };

  const onSubmit = async (data: any) => {
    const payload = {
      id: router.query.id,
      name: data.name,
      indicators: indicatorTemplate?.indicators,
    };

    setSaveLoading(true);
    try {
      const fetchResponse = (await fetch("/api/indicators", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })) as any;
      await fetchResponse.json();
      router.push("/dashboard/supervisor/indicadores/plantillas");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setSaveLoading(false);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <SectionTitle title="Plantilla" subtitle="Editar Plantilla" />

          {loadingIndicatorTemplate ? (
            <div className="flex">
              <Spinner color="info" aria-label="Info spinner example" />
              <div className="ml-2 mt-1">Cargando Plantilla</div>
            </div>
          ) : (
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
                  <div className="flex flex-row flex-wrap">
                    {indicatorTemplate?.indicators &&
                      indicatorTemplate?.indicators.map((indicator, index) => (
                        <Indicator
                          key={index}
                          id={indicator.id}
                          title={indicator.source.name}
                          description={indicator.name}
                          isChecked={indicator.checked}
                          onChange={(id, checked: boolean) => {
                            //upadte indicatorTemplate checked state
                            const newIndicatorTemplate = {
                              ...indicatorTemplate,
                              indicators: indicatorTemplate?.indicators.map(
                                (indicator) => {
                                  if (indicator.id === id) {
                                    return {
                                      ...indicator,
                                      checked,
                                    };
                                  } else {
                                    return indicator;
                                  }
                                }
                              ),
                            };
                            setIndicatorTemplate(newIndicatorTemplate);
                          }}
                        />
                      ))}
                  </div>
                </Widget>
              </div>
              <div className="w-2/4 ml-5">
                {/* Parametros */}
                <Widget title="Parametros" description="">
                  {indicatorTemplate?.indicators &&
                  indicatorTemplate?.indicators.length > 0 ? (
                    <Accordion collapseAll={true}>
                      {indicatorTemplate?.indicators.map((indicator) => {
                        if (indicator.checked) {
                          return (
                            <Accordion.Panel key={indicator.id}>
                              <Accordion.Title>
                                {indicator.name}
                              </Accordion.Title>
                              <Accordion.Content>
                                {(() => {
                                  switch (indicator.associated_function) {
                                    case "years-of-activity":
                                      return (
                                        /* TODO: Traer desde base de datos o configuracion valores por defecto */
                                        <YearsOfActivityParameters
                                          defaultConfig={indicator.config}
                                          onChange={(data: any) => {
                                            //update 'years-of-activity' config in indicatorTemplate
                                            const newIndicatorTemplate = {
                                              ...indicatorTemplate,
                                              indicators:
                                                indicatorTemplate?.indicators.map(
                                                  (indicator) => {
                                                    if (
                                                      indicator.associated_function ===
                                                      "years-of-activity"
                                                    ) {
                                                      return {
                                                        ...indicator,
                                                        config: data,
                                                      };
                                                    } else {
                                                      return indicator;
                                                    }
                                                  }
                                                ),
                                            };
                                            setIndicatorTemplate(
                                              newIndicatorTemplate
                                            );
                                          }}
                                        />
                                      );
                                    default:
                                      return null;
                                  }
                                })()}
                              </Accordion.Content>
                            </Accordion.Panel>
                          );
                        } else {
                          return <></>;
                        }
                      })}
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
                    <Button disabled={saveLoading} type="submit">
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
          )}
        </form>
      </FormProvider>
    </>
  );
};

export default Index;
