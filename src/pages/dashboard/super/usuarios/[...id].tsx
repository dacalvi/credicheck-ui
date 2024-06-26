import {ErrorMessage} from "components/forms/error-message";
import {InputWrapper} from "components/forms/input-wrapper";
import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Input} from "components/react-hook-form/input";
import {Label} from "flowbite-react";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {Loading} from "components/loading";
import {useState} from "react";
import Alert from "components/alerts";
import {FiAlertCircle} from "react-icons/fi";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {Select} from "components/react-hook-form/select";
import {useAppSelector} from "store";

export type FormProps = {
  email: string;
  password: string;
  repassword: string;
  roleId: number | null;
  companyId: number | null;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();
  const roles = useAppSelector((state) => state.roles);
  const [companiesArray, setCompaniesArray] = useState([]);
  const rolesArray = roles.map((role) => {
    return {
      key: role.id,
      value: role.name,
    };
  });

  const loadCompanies = async () => {
    const res = await fetch("/api/companies");
    const {companies} = await res.json();

    const companiesArray = companies.map((company: any) => {
      return {
        key: company.id,
        value: company.name,
      };
    });
    setCompaniesArray(companiesArray);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadCompanies();
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
    control,
    register,
    setValue,
  } = methods;

  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [companyId, setCompanyId] = useState<number | null>(null);

  const onSubmit = async (data: FormProps) => {
    try {
      setLoading(true);
      data.roleId = roleId;
      data.companyId = companyId;
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        setLoading(false);
      } else {
        setLoading(false);
        setShowSuccessMessage(true);
        //empty password fields
        setValue("password", "");
        setValue("repassword", "");
      }
      //check response, if success is false, dont take them to success page
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("there was an error submitting", error);
    }
    //eslint-disable-next-line
    console.log(JSON.stringify(data, null, 2));
  };

  //get the user from the api using the id from the url
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoadingUser(true);
        const response = await fetch("/api/users/" + router.query.id, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        });
        setLoadingUser(false);
        if (response.status === 200) {
          const data = await response.json();
          reset({
            email: data.user.email,
            password: data.user.password,
          });
          setRoleId(data.user.roleId);
          setCompanyId(data.user.companyId);
          setValue("companyId", data.user.companyId);
          setValue("roleId", data.user.roleId);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("there was an error submitting", error);
      }
    };
    if (router.query.id) {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, reset]);

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
      <SectionTitle title="Usuarios" subtitle="Editar Usuario" />
      <Widget>
        {loadingUser ? (
          <Loading size={35} message="Cargando usuario..." />
        ) : loading ? (
          <Loading size={35} message="Actualizando usuario..." />
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
                      readonly={true}
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
                    <Label>Repetir Contraseña</Label>
                    <Input
                      id="repassword"
                      name="repassword"
                      type="password"
                      rules={{
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
                    {errors?.repassword?.message && (
                      <ErrorMessage>{errors.repassword.message}</ErrorMessage>
                    )}
                  </InputWrapper>
                  <InputWrapper outerClassName="sm:col-span-12">
                    <Controller
                      name="roleId"
                      control={control}
                      render={({field}) => (
                        <Select
                          id="roleId"
                          width="w-48"
                          placeholder="Selecciona unn rol"
                          options={rolesArray}
                          {...register("roleId", {
                            onChange: (e) => {
                              setRoleId(e.target.value);
                            },
                          })}
                          {...field}
                        />
                      )}
                    />
                  </InputWrapper>

                  <InputWrapper outerClassName="sm:col-span-12">
                    <Controller
                      name="companyId"
                      control={control}
                      render={({field}) => (
                        <Select
                          id="companyId"
                          width="w-48"
                          placeholder="Selecciona una Pyme"
                          options={companiesArray}
                          {...register("companyId", {
                            onChange: (e) => {
                              setCompanyId(e.target.value);
                            },
                          })}
                          {...field}
                        />
                      )}
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
                  Actualizar Usuario
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
