import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ErrorMessage} from "components/react-hook-form/error-message";
import {Input} from "components/react-hook-form/input";
import Layout from "layouts/centered";
import CenteredForm from "layouts/centered-form";
import {useEffect, useState} from "react";
import {Loading} from "components/loading";
import {DefaultTabs} from "components/tabs";
import {useRouter} from "next/router";

export type CiecFormProps = {
  rfc: string;
  password: string;
  uuid: string;
};

export type EfirmaFormProps = {
  certificate: string;
  privateKey: string;
  password: string;
  uuid: string;
};

const Ciec: React.FC<{rfc: string}> = ({rfc}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const methods = useForm<CiecFormProps>({
    defaultValues: {
      rfc: rfc,
      password: "",
      uuid: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const onSubmit = async (data: CiecFormProps) => {
    setLoading(true);
    data.uuid = router.query.id as string;
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/credentials/ciec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const body = await response.json();
    if (body.id !== null) {
      router.reload();
    }

    setLoading(false);

    // eslint-disable-next-line no-console
    console.log(response);
  };
  return !loading ? (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
              <InputWrapper outerClassName="sm:col-span-12">
                <Label id="email">RFC</Label>
                <Input
                  id="rfc"
                  name="rfc"
                  type="text"
                  rules={{required: "Please enter a valid rfc"}}
                />
                {errors?.rfc?.message && (
                  <ErrorMessage>{errors.rfc.message}</ErrorMessage>
                )}
              </InputWrapper>

              <InputWrapper outerClassName="sm:col-span-12">
                <Label id="password">Contrasena</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  rules={{
                    required: "Please enter a password",
                    minLength: {
                      value: 8,
                      message:
                        "Your password should have at least 8 characters",
                    },
                    maxLength: {
                      value: 100,
                      message:
                        "Your password should have no more than 100 characters",
                    },
                  }}
                />
                {errors?.password?.message && (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
              </InputWrapper>
            </div>
          </div>

          <div className="flex justify-start space-x-2 mt-5">
            <button
              onClick={() => {
                reset();
              }}
              type="button"
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Ingresar
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  ) : (
    <Loading size={35} message="Autenticando usuario..." />
  );
};

const Efirma: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const methods = useForm<EfirmaFormProps>({
    defaultValues: {
      certificate: "",
      privateKey: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: {errors},
  } = methods;

  const onSubmit = async (data: EfirmaFormProps) => {
    setLoading(true);
    //eslint-disable-next-line
    console.log(JSON.stringify(data, null, 2));

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/credentials/efirma",
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
  };
  return !loading ? (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
              <InputWrapper outerClassName="sm:col-span-12">
                <Label id="email">Certificate</Label>
                <Input
                  id="certificate"
                  name="certificate"
                  type="email"
                  rules={{required: "Please add a certificate"}}
                />
                {errors?.certificate?.message && (
                  <ErrorMessage>{errors.certificate.message}</ErrorMessage>
                )}
              </InputWrapper>

              <InputWrapper outerClassName="sm:col-span-12">
                <Label id="email">Private Key</Label>
                <Input
                  id="privateKey"
                  name="privateKey"
                  type="email"
                  rules={{required: "Please add a private key"}}
                />
                {errors?.privateKey?.message && (
                  <ErrorMessage>{errors.privateKey.message}</ErrorMessage>
                )}
              </InputWrapper>

              <InputWrapper outerClassName="sm:col-span-12">
                <Label id="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  rules={{
                    required: "Please enter a password",
                    minLength: {
                      value: 4,
                      message:
                        "Your password should have at least 4 characters",
                    },
                    maxLength: {
                      value: 8,
                      message:
                        "Your password should have no more than 8 characters",
                    },
                  }}
                />
                {errors?.password?.message && (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
              </InputWrapper>
            </div>
          </div>

          <div className="flex justify-start space-x-2 mt-5">
            <button
              onClick={() => {
                reset();
              }}
              type="button"
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex justify-center px-3 py-2 ml-3 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Ingresar
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  ) : (
    <Loading size={35} message="Autenticando usuario..." />
  );
};

const Credenciales: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [idPresent, setIdPresent] = useState(false);
  const [rfc, setRfc] = useState("");
  const [clientFound, setClientFound] = useState(false);

  const loadClient = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          `/crud/clients?where={"uuid": "${router.query.id}"}`,
        {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        }
      );

      setLoading(false);
      const body = await response.json();
      // eslint-disable-next-line no-console
      console.log(body);
      if (body.length === 0) {
        setClientFound(false);
      } else {
        setClientFound(true);
        if (body[0].rfc !== null) {
          setRfc(body[0].rfc);
        }
        if (body[0].satwsid !== null) {
          setIdPresent(true);
        }
      }
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("there was an error submitting", error);
      return false;
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    loadClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const tabs = [
    {index: 0, title: "Ciec", active: true, content: <Ciec rfc={rfc} />},
    {index: 1, title: "E-firma", active: false, content: <Efirma />},
  ];

  return (
    <>
      <Layout>
        <div className="h-96">
          {loading && <Loading size={35} message="Cargando ..." />}

          {!loading && !clientFound && <>No encontrado</>}

          {!loading && clientFound && !idPresent ? (
            <CenteredForm
              title="Credenciales Fiscales"
              subtitle="Por favor ingrese sus credenciales">
              <small>
                <p className="text-sm text-gray-500 pb-10 text-red-500">
                  Al proporcionar tus credenciales del SAT, permites que Satws
                  recupere tus datos fiscales.
                </p>
              </small>
              <DefaultTabs tabs={tabs} />
            </CenteredForm>
          ) : null}

          {!loading && clientFound && idPresent && <>Gracias</>}
        </div>
      </Layout>
    </>
  );
};

export default Credenciales;
