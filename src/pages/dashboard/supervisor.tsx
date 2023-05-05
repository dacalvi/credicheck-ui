import Widget1 from "components/dashboard/widget-1";
import Section from "components/dashboard/section";
import SectionTitle from "components/dashboard/section-title";
import {FiActivity, FiUsers} from "react-icons/fi";
import Markets from "components/dashboard/markets";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {useRouter} from "next/router";

const Index: React.FC = () => {
  const {status, data} = useSession();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [router, status]);

  return (
    <>
      <SectionTitle title="Supervisor" subtitle="Tablero inicial" />

      <div className="flex flex-col w-full mb-2 lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Prospectos"
            description={588}
            right={
              <FiUsers size={24} className="text-gray-500 stroke-current" />
            }
          />
        </div>
        <div className="w-full lg:w-1/4">
          <Widget1
            title="Procesos"
            description={435}
            right={
              <FiActivity size={24} className="text-gray-500 stroke-current" />
            }
          />
        </div>
      </div>

      <div className="w-full mb-2 lg:space-x-2 space-y-2 lg:space-y-0 lg:mb-4">
        <Section
          title="Users"
          description={<span>Most important markets</span>}>
          <div className="flex flex-col w-full">
            <div className="overflow-x-scroll lg:overflow-hidden">
              <Markets />
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};
export default Index;
