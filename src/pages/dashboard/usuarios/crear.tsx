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
import {Select} from "components/forms/select";
import {useAppSelector} from "store";

export type FormProps = {
  email: string;
  password: string;
  roleId: number | null;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();
  const roles = useAppSelector((state) => state.roles);

  //rename id to key and name to value in the roles array
  const rolesArray = roles.map((role) => {
    return {
      key: role.id,
      value: role.name,
    };
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [router, status]);

  const methods = useForm<FormProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);

  const onSubmit = async (data: FormProps) => {
    try {
      setLoading(true);
      data.roleId = roleId;
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.log("something went wrong");
        //set an error banner here
      } else {
        setLoading(false);
        setShowSuccessMessage(true);
        reset();
        // eslint-disable-next-line no-console
        console.log("form submitted successfully !!!");
        //set a success banner here
      }
      //check response, if success is false, dont take them to success page
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("there was an error submitting", error);
    }
    //eslint-disable-next-line
    console.log(JSON.stringify(data, null, 2));
  };

  return (
    <>
      {showSuccessMessage ? (
        <Alert
          color="bg-green-500 text-white"
          icon={<FiAlertCircle className="w-4 h-4 mr-2 stroke-current" />}
          onClick={() => setShowSuccessMessage(false)}>
          Usuario Creado Correctamente
        </Alert>
      ) : null}
      <SectionTitle title="Usuarios" subtitle="Crear Usuario" />
      <Widget>
        {loading ? (
          <Loading size={35} message="Creando usuario..." />
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6 w-2/5">
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-12">
                  <InputWrapper outerClassName="sm:col-span-12">
                    <Label>Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      rules={{
                        required: "Email es requerido",
                        minLength: {
                          value: 4,
                          message: "Email debe tener al menos 4 caracteres",
                        },
                      }}
                    />
                    {errors?.email?.message && (
                      <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                  </InputWrapper>

                  <InputWrapper outerClassName="sm:col-span-12">
                    <Label>Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      rules={{
                        required: "Contraseña es requerida",
                        minLength: {
                          value: 4,
                          message:
                            "Contraseña debe tener al menos 4 caracteres",
                        },
                        maxLength: {
                          value: 16,
                          message:
                            "Contraseña no debe tener mas de 16 caracteres",
                        },
                      }}
                    />
                    {errors?.password?.message && (
                      <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                  </InputWrapper>

                  <InputWrapper outerClassName="sm:col-span-12">
                    <Label>Rol</Label>
                    <Select
                      width="w-48"
                      name="roleId"
                      placeholder="Seleccione un rol"
                      options={rolesArray}
                      onChange={(e) => {
                        // eslint-disable-next-line no-console
                        console.log(e.target.value);
                        setRoleId(parseInt(e.target.value));
                      }}
                    />
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
                  Crear Usuario
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
