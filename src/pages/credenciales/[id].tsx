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

const Ciec: React.FC<{rfc: string; isLoading: any}> = ({rfc, isLoading}) => {
  const router = useRouter();

  const methods = useForm<CiecFormProps>({
    defaultValues: {
      password: "",
      uuid: "",
    },
  });

  const {
    handleSubmit,
    formState: {errors},
  } = methods;

  const onSubmit = async (data: CiecFormProps) => {
    isLoading(true);
    data.uuid = router.query.id as string;

    const response = await fetch(
      process.env.VERCEL_URL + "/api/credentials/ciec",
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

    isLoading(false);

    // eslint-disable-next-line no-console
    console.log(response);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
              <InputWrapper outerClassName="sm:col-span-12">
                <Label id="email">
                  RFC: <strong>{rfc}</strong>
                </Label>
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
              type="submit"
              className="inline-flex justify-center px-3 py-2  text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {" "}
              Ingresar
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

const Credenciales: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [idPresent, setIdPresent] = useState(false);
  const [rfc, setRfc] = useState("");
  const [clientFound, setClientFound] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("isPending", isPending);
    // eslint-disable-next-line no-console
    console.log("isActive", isActive);
  }, [isPending, isActive]);

  const loadClient = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        process.env.VERCEL_URL +
          `/api/crud/clients?where={"uuid": "${router.query.id}"}`,
        {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        }
      );

      setLoading(false);
      const body = await response.json();

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
        if (body[0].credentials_status === "pending") {
          setIsPending(true);
          setIsRejected(false);
          setIsActive(false);
        }
        if (body[0].credentials_status === "rejected") {
          setIsRejected(true);
          setIsPending(false);
          setIsActive(false);
        }
        if (body[0].credentials_status === "active") {
          setIsActive(true);
          setIsPending(false);
          setIsRejected(false);
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
    {
      index: 0,
      title: "Ciec",
      active: true,
      content: (
        <Ciec
          rfc={rfc}
          isLoading={(loadingState: boolean) => {
            setLoading(loadingState);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <Layout>
        <div className="h-96">
          {!loading && !clientFound && <>No encontrado</>}

          {!loading && clientFound && !idPresent && !isRejected && (
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
          )}

          {loading && (
            <Loading size={35} message="Comprobando credenciales ..." />
          )}

          {!loading && isRejected && <>Gracias.</>}
          {!loading && clientFound && idPresent && <>Gracias</>}
        </div>
      </Layout>
    </>
  );
};

export default Credenciales;
