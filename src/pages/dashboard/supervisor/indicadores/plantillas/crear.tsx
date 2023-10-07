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

type CheckedIndicator = {
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

export type FormProps = {
  name: string;
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
    const response = await fetch("/api/indicators");
    const data = await response.json();
    setIndicators(data.indicators?.indicators);
    setLoadingIndicators(false);
  };

  const onSubmit = async (data: any) => {
    const payload = {
      name: data.name,
      indicators: checkedIndicators,
    };
    setSaveLoading(true);
    try {
      const fetchResponse = (await fetch("/api/indicators", {
        method: "POST",
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
                                  order: indicator.order,
                                  sourceId: indicator.sourceId,
                                  source: {
                                    name: indicator.source.name,
                                  },
                                  associated_function:
                                    indicator.associated_function,
                                  defaultConfig: indicator.defaultConfig,
                                  config: indicator.defaultConfig,
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
                    {checkedIndicators.map((indicator, index) => (
                      <Accordion.Panel key={indicator.id}>
                        <Accordion.Title>{indicator.name}</Accordion.Title>
                        <Accordion.Content>
                          {(() => {
                            switch (indicator.id) {
                              case 1:
                                return (
                                  /* TODO: Traer desde base de datos o configuracion valores por defecto */
                                  <YearsOfActivityParameters
                                    defaultConfig={indicator.defaultConfig}
                                    onChange={(data: any) => {
                                      //update config value in checkedIndicators array using data
                                      const newCheckedIndicators = [
                                        ...checkedIndicators,
                                      ];
                                      newCheckedIndicators[index].config = data;
                                      setCheckedIndicators(
                                        newCheckedIndicators
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
