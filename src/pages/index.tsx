import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {useRouter} from "next/router";

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
    if (status === "unauthenticated") {
      router.replace("/home");
    }
  }, [router, status]);

  return <>Cargando...</>;
};
export default Index;
