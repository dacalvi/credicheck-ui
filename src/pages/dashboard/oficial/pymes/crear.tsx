import {Select} from "components/forms/select";
import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Button, Label, Spinner, TextInput} from "flowbite-react";
import {sendMail} from "functions/mail";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {get_url} from "../../../../functions/helpers/index";

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPersonaMoral, setIsPersonaMoral] = useState(true);
  const [indicatorTemplates, setIndicatorTemplates] = useState<any[]>([]);
  const [loadingIndicatorTemplates, setLoadingIndicatorTemplates] =
    useState(false);
  const [rfc_valid, setRfcValid] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadIndicatorTemplates();
    }
  }, [router, status]);

  const {control, handleSubmit, getValues, register} = useForm({
    defaultValues: {
      email: "",
      cellPhone: "",
      firstName: "",
      lastName: "",
      rfc: "",
      startProcess: "false",
      companyName: "",
      indicatorTemplate: "0",
      validate_rfc: false,
    },
  });

  const loadIndicatorTemplates = async () => {
    setLoadingIndicatorTemplates(true);
    const response = await fetch("/api/indicator_templates");
    const data = await response.json();

    const indicatorTemplates = data.indicatorTemplates.map(
      (indicator_template: any) => {
        return {
          key: indicator_template.id,
          value: indicator_template.name,
        };
      }
    );

    //add an element on top of the array with the default value
    indicatorTemplates.unshift({
      key: "0",
      value: "No generar reporte por el momento",
    });

    setIndicatorTemplates(indicatorTemplates);
    setLoadingIndicatorTemplates(false);
  };

  const onSubmit = async (data: any) => {
    //prompt if rfc is not valid
    if (rfc_valid === false) {
      alert("RFC no valido");
      return;
    }

    try {
      setLoading(true);
      const fetchResponse = (await fetch("/api/prospects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })) as any;

      const response = await fetchResponse.json();

      //uncomment to enable mail functions

      sendMail(
        response.newProspect.email,
        "Ingreso de Credenciales SAT",
        `Hola, 
          necesitamos que ingreses tus credenciales de SAT en el siguiente link 
          <a href='${get_url()}/credenciales/${response.newProspect.uuid}' 
            target='_blank'>${get_url()}/credenciales/${
          response.newProspect.uuid
        }</a>`
      );

      setLoading(false);
      router.push("/dashboard/oficial/pymes");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const validarRFC = async (rfc: string) => {
    try {
      const fetchResponse = (await fetch("/api/prospects/validate_rfc/" + rfc, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })) as any;
      const response = await fetchResponse.json();
      return response.success;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SectionTitle title="Clientes" subtitle="Nuevo Cliente" />
      <div className="w-2/4">
        <Widget
          title="Informacion de Contacto"
          description={
            <span>
              Informacion para enviar la solicitud de acceso a SAT y BURO
            </span>
          }>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="rfc" value="RFC" />
              </div>
              <Controller
                name="rfc"
                control={control}
                render={({field: {onChange, value, ref}}) => (
                  <>
                    <TextInput
                      onChange={onChange} // send value to hook form
                      readOnly={false}
                      onBlur={async () => {
                        if (value.length === 12) {
                          setIsPersonaMoral(true);
                          if (getValues("validate_rfc") === true) {
                            const r = await validarRFC(value);
                            setRfcValid(r);
                          }
                        } else if (value.length === 13) {
                          setIsPersonaMoral(false);
                        } else {
                          setIsPersonaMoral(true);
                        }
                      }} // notify when input is touched
                      value={value} // return updated value
                      ref={ref} // set ref for focus management
                      maxLength={12}
                      color={
                        rfc_valid === undefined
                          ? "gray"
                          : rfc_valid
                          ? "success"
                          : "failure"
                      }
                    />
                  </>
                )}
              />

              <Controller
                name="validate_rfc"
                control={control}
                render={({field: {onChange, value}}) => (
                  <div className="flex items-center space-x-2 mt-3">
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        checked={!!value}
                        onChange={onChange}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 form-checkbox focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="shrink-0 block font-medium text-gray-700 whitespace-nowrap dark:text-white">
                        Validar RFC
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>

            {isPersonaMoral && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="companyName" value="Nombre de la empresa" />
                </div>
                <Controller
                  name="companyName"
                  control={control}
                  render={({field}) => (
                    <TextInput
                      id="companyName"
                      type="text"
                      placeholder="Credicheck"
                      required={true}
                      {...field}
                    />
                  )}
                />
              </div>
            )}

            {!isPersonaMoral && (
              <div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="firstName" value="Nombre" />
                  </div>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({field}) => (
                      <TextInput
                        id="firstName"
                        type="text"
                        placeholder="Juan"
                        required={true}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="lastName" value="Apellido" />
                  </div>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({field}) => (
                      <TextInput
                        id="lastName"
                        type="text"
                        placeholder="Perez"
                        required={true}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Email" />
              </div>
              <Controller
                name="email"
                control={control}
                render={({field}) => (
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="daniel@credicheck.com"
                    required={true}
                    {...field}
                  />
                )}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="cellPhone" value="Celular" />
              </div>
              <Controller
                name="cellPhone"
                control={control}
                render={({field}) => (
                  <TextInput
                    id="cellPhone"
                    type="text"
                    placeholder="55 1234 5678"
                    required={true}
                    {...field}
                  />
                )}
              />
            </div>

            <Widget description={<span>Plantillas de Reporte</span>}>
              <div className="space-y-6">
                {loadingIndicatorTemplates ? (
                  <div className="flex justify-center">
                    <Spinner aria-label="Spinner example" />
                  </div>
                ) : (
                  <Controller
                    name="indicatorTemplate"
                    control={control}
                    render={({field}) => (
                      <Select
                        placeholder="Selecciona un cliente"
                        options={indicatorTemplates}
                        {...register("indicatorTemplate", {
                          onChange: () => {
                            //console.log(e.target.value);
                          },
                        })}
                        {...field}
                      />
                    )}
                  />
                )}
              </div>
            </Widget>

            <div className="mt-4">
              <Button
                disabled={loading || loadingIndicatorTemplates}
                type="submit">
                {loading && <Spinner aria-label="Spinner button example" />}
                <span className={loading ? "pl-3" : ""}>
                  {loading ? "Guardando...." : "Guardar"}
                </span>
              </Button>
            </div>
          </form>
        </Widget>
      </div>
    </>
  );
};
export default Index;
