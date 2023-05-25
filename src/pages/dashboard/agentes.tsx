import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

import React, {useEffect} from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import Dcrud from "components/dcrud";

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const options = {
    table: "roles",
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [router, status]);

  return <Dcrud options={options} />;
};

export default Index;
