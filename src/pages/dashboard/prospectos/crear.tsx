import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Button, Checkbox, Label, Spinner, TextInput} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/prospects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      // eslint-disable-next-line no-console
      console.log(response);
      setLoading(false);
      router.push("/dashboard/prospectos");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SectionTitle title="Prospectos" subtitle="Nuevo Prospecto" />
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
                <Label htmlFor="email1" value="Your email" />
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

            <div>
              <div className="mb-2 block">
                <Label htmlFor="rfc" value="RFC" />
              </div>
              <Controller
                name="rfc"
                control={control}
                render={({field}) => (
                  <TextInput
                    id="rfc"
                    type="text"
                    placeholder="ANYG000200GD3"
                    required={true}
                    {...field}
                  />
                )}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="startProcess" value="Iniciar Proceso" />
              </div>
              <Controller
                name="startProcess"
                control={control}
                render={({field}) => <Checkbox id="startProcess" {...field} />}
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