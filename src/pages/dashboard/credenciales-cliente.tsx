import SectionTitle from "components/section-title";
import Widget from "components/widget";
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
      <SectionTitle title="Pages" subtitle="Empty page" />
      <Widget title="Page title" description={<span>Page description</span>}>
        <p>This is an empty page</p>
      </Widget>
    </>
  );
};
export default Index;
