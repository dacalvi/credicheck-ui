import {Select} from "components/forms/select";
import {Loading} from "components/loading";
import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Button, Label, Spinner, TextInput} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  const loadClients = async () => {
    setClientsLoading(true);
    const response = await fetch("/api/prospects");
    const data = await response.json();
    const clients = data.prospects.map((prospect: any) => {
      return {
        key: prospect.id,
        value:
          prospect.firstName + " " + prospect.lastName + " - " + prospect.rfc,
      };
    });
    setClients(clients);
    setClientsLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadClients();
    }
  }, [router, status]);

  const {control, handleSubmit} = useForm({
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/processes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // eslint-disable-next-line no-console
      console.log(response);
      setLoading(false);
      router.push("/dashboard/reportes");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SectionTitle title="Reportes" subtitle="Nuevo Reporte" />
      <div className="w-2/4">
        {clientsLoading && (
          <Loading size={35} message="Cargando lista de clientes..." />
        )}

        {!clientsLoading && (
          <Widget
            title="Informacion del reporte"
            description={<span>Informacion para seguir el nuevo reporte</span>}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="clientId" value="Cliente" />
                </div>
                <Controller
                  name="clientId"
                  control={control}
                  render={({field}) => (
                    <Select
                      placeholder="Selecciona un cliente"
                      {...field}
                      options={clients}
                    />
                  )}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Nombre del reporte" />
                </div>
                <Controller
                  name="name"
                  control={control}
                  render={({field}) => (
                    <TextInput
                      id="name"
                      type="text"
                      placeholder="Nombre del reporte"
                      required={true}
                      {...field}
                    />
                  )}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Descripcion" />
                </div>
                <Controller
                  name="description"
                  control={control}
                  render={({field}) => (
                    <TextInput
                      id="description"
                      type="text"
                      placeholder="Descripcion"
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
        )}
      </div>
    </>
  );
};
export default Index;
