import SectionTitle from "components/section-title";
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
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle
            title="Configuracion del cache"
            subtitle="Configuracion"
          />
        </div>
        <div></div>
      </div>
    </>
  );
};
export default Index;
