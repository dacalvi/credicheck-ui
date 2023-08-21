import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Button, Label, Spinner, TextInput} from "flowbite-react";
import {sendMail} from "functions/mail";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPersonaMoral, setIsPersonaMoral] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [router, status]);

  const {control, handleSubmit} = useForm({
    defaultValues: {
      email: "",
      cellPhone: "",
      firstName: "",
      lastName: "",
      rfc: "",
      startProcess: "false",
      companyName: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const fetchResponse = (await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/prospects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )) as any;

      const response = await fetchResponse.json();

      //uncomment to enable mail functions

      sendMail(
        response.newProspect.email,
        "Ingreso de Credenciales SAT",
        `Hola, 
          necesitamos que ingreses tus credenciales de SAT en el siguiente link 
          <a href='${process.env.NEXT_PUBLIC_URL}/credenciales/${response.newProspect.uuid}' 
            target='_blank'>${process.env.NEXT_PUBLIC_URL}/credenciales/${response.newProspect.uuid}</a>`
      );

      // eslint-disable-next-line no-console
      console.log(response);
      setLoading(false);
      router.push("/dashboard/clientes");
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
                      onBlur={() => {
                        if (value.length === 12) {
                          setIsPersonaMoral(true);
                        } else if (value.length === 13) {
                          setIsPersonaMoral(false);
                        } else {
                          setIsPersonaMoral(false);
                        }
                      }} // notify when input is touched
                      value={value} // return updated value
                      ref={ref} // set ref for focus management
                      maxLength={12}
                    />
                  </>
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

            <div className="mt-4">
              <Button disabled={loading} type="submit">
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
