import {ErrorMessage} from "components/forms/error-message";
import {InputWrapper} from "components/forms/input-wrapper";
import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Input} from "components/react-hook-form/input";
import {Label} from "flowbite-react";
import {FormProvider, useForm} from "react-hook-form";
import {Loading} from "components/loading";
import {useState} from "react";
import Alert from "components/alerts";
import {FiAlertCircle} from "react-icons/fi";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect} from "react";

export type FormProps = {
  name: string;
  description: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [router, status]);

  const methods = useForm<FormProps>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const onSubmit = async (data: FormProps) => {
    try {
      setLoading(true);

      const response = await fetch("/api/charts/" + router.query.id, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        setLoading(false);
      } else {
        setLoading(true);
        setShowSuccessMessage(true);
        reset();
        //redirect to companies page
        setTimeout(() => {
          router.push("/dashboard/super/graficos");
          setLoading(false);
        }, 2000);
      }
      //check response, if success is false, dont take them to success page
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("there was an error submitting", error);
    }
  };

  //get the user from the api using the id from the url
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/charts/" + router.query.id, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        });
        if (response.status === 200) {
          const data = await response.json();
          //set the form values here
          reset({
            name: data.chart.name,
            description: data.chart.description,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("there was an error submitting", error);
      }
    };
    if (router.query.id) {
      getUser();
    }
  }, [router.query.id, reset]);

  return (
    <>
      {showSuccessMessage ? (
        <Alert
          color="bg-green-500 text-white"
          icon={<FiAlertCircle className="w-4 h-4 mr-2 stroke-current" />}
          onClick={() => setShowSuccessMessage(false)}>
          Grafico Editado Correctamente
        </Alert>
      ) : null}
      <SectionTitle title="Graficos" subtitle="Editar Grafico" />
      <Widget>
        {loading ? (
          <Loading size={35} message="Cargando grafico..." />
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6 w-2/5">
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-12">
                  <InputWrapper outerClassName="sm:col-span-12">
                    <Label>Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      rules={{
                        required: "Nombre es requerido",
                        minLength: {
                          value: 4,
                          message: "Nombre debe tener al menos 4 caracteres",
                        },
                      }}
                    />
                    {errors?.name?.message && (
                      <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                  </InputWrapper>
                </div>
              </div>

              <div className="space-y-6 w-2/5">
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-12">
                  <InputWrapper outerClassName="sm:col-span-12">
                    <Label>Descripcion</Label>
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      rules={{
                        required: "Descripcion es requerido",
                        minLength: {
                          value: 4,
                          message:
                            "Descripcion debe tener al menos 4 caracteres",
                        },
                      }}
                    />
                    {errors?.description?.message && (
                      <ErrorMessage>{errors.description.message}</ErrorMessage>
                    )}
                  </InputWrapper>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    reset();
                  }}
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Actualizar Grafico
                </button>
              </div>
            </form>
          </FormProvider>
        )}
      </Widget>
    </>
  );
};
export default Index;
