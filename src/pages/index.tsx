import {useEffect} from "react";
import {useRouter} from "next/router";

const Index: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return <>Cargando...</>;
};
export default Index;
