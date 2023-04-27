import SectionTitle from "components/section-title";
import Widget from "components/widget";
import {Button, Label, TextInput} from "flowbite-react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect} from "react";

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [router, status]);
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
          <form className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Email" />
              </div>
              <TextInput
                id="email1"
                type="email"
                placeholder="info@credicheck.com"
                required={true}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1" value="Numero de Celular" />
              </div>
              <TextInput
                id="email1"
                type="email"
                placeholder=""
                required={true}
              />
            </div>

            <Button type="submit">Iniciar Proceso</Button>
          </form>
        </Widget>
      </div>
    </>
  );
};
export default Index;
