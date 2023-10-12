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
  const [company, setCompany] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      const {id} = router.query;
      if (id) {
        loadCompany(Number(id));
      }
    }
  }, [router, status]);

  const loadCompany = async (id: number) => {
    try {
      const response = await fetch(`/api/companies/${id}`);
      const result = await response.json();
      setCompany(result.company.name);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const {control, handleSubmit, setValue} = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    setValue("name", company || "");
  }, [company, setValue]);

  const onSubmit = async (data: any) => {
    const {id} = router.query;
    try {
      setLoading(true);
      const response = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setLoading(false);
      if (result.success) {
        router.push("/dashboard/super/empresas");
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
      <SectionTitle title="Reportes" subtitle="Nuevo Reporte" />
      <div className="w-2/4">
        <Widget
          title="Informacion de la empresa"
          description={<span>Informacion para crear una nueva empresa</span>}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Nombre de la empresa" />
              </div>
              <Controller
                name="name"
                control={control}
                render={({field}) => (
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="Nombre de la empresa"
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
