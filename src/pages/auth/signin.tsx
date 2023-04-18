import {useForm, FormProvider} from "react-hook-form";
import {InputWrapper} from "components/react-hook-form/input-wrapper";
import {Label} from "components/react-hook-form/label";
import {ErrorMessage} from "components/react-hook-form/error-message";
import {Input} from "components/react-hook-form/input";
import Layout from "layouts/centered";
import CenteredForm from "layouts/centered-form";
import {useRouter} from "next/router";
import {signIn} from "next-auth/react";
import {useState} from "react";
import {Loading} from "components/loading";

export type FormProps = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (data: FormProps) => {
    setLoading(true);
    //eslint-disable-next-line
    console.log(JSON.stringify(data, null, 2));

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);

    // eslint-disable-next-line no-console
    console.log(res);

    if (res?.ok) {
      router.replace("/dashboard");
    }
  };

  return (
    <>
      <Layout>
        <CenteredForm
          title="Ingresar"
          subtitle="Por favor ingrese su usuario y contraseña">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {!loading ? (
                <div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-12">
                      <InputWrapper outerClassName="sm:col-span-12">
                        <Label id="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          rules={{required: "Please enter a valid email"}}
                        />
                        {errors?.email?.message && (
                          <ErrorMessage>{errors.email.message}</ErrorMessage>
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

                  <div className="flex justify-start space-x-2">
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
              ) : (
                <Loading size={35} message="Autenticando usuario..." />
              )}
            </form>
          </FormProvider>
        </CenteredForm>
      </Layout>
    </>
  );
};
export default SignIn;
