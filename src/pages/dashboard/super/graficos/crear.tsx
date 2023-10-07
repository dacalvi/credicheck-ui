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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [router, status]);

  const {control, handleSubmit} = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/charts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);
      if (result.success) {
        router.push("/dashboard/super/graficos");
      } else {
        alert(result.message);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SectionTitle title="Graficos" subtitle="Nuevo Grafico" />
      <div className="w-2/4">
        <Widget
          title="Informacion de el grafico"
          description={<span>Informacion para crear un nuevo grafico</span>}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Nombre" />
              </div>
              <Controller
                name="name"
                control={control}
                render={({field}) => (
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Nombre"
                    required={true}
                    {...field}
                  />
                )}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Descripcion" />
              </div>
              <Controller
                name="description"
                control={control}
                render={({field}) => (
                  <TextInput
                    id="description"
                    type="text"
                    placeholder="Descripcion del grafico"
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
