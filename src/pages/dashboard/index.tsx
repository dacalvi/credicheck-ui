import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {Spinner} from "flowbite-react";

const Index: React.FC = () => {
  const {status, data} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }

    if (data?.user?.roleId === 2) {
      router.replace("/dashboard/supervisor");
    } else if (data?.user?.roleId === 3) {
      router.replace("/dashboard/oficial");
    } else if (data?.user?.roleId === 1) {
      router.replace("/dashboard/super");
    }
  }, [data, router, status]);

  return (
    <>
      <div className="flex">
        <Spinner color="info" aria-label="Info spinner example" />
        <div className="ml-2 mt-1">Redirigiendo al tablero...</div>
      </div>
    </>
  );
};
export default Index;
