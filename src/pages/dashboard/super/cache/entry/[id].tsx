import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Spinner} from "flowbite-react";
import {JsonView, allExpanded, darkStyles} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

type CacheEntry = {
  id: number;
  url: string;
  method: string;
  headers: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [cacheEntry, setCacheEntry] = useState<CacheEntry>();
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const loadCacheEntry = async () => {
    setLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/cache/entry/" + router.query.id
    );
    const data = await response.json();
    if (data.cacheEntry.content === "") {
      setCacheEntry(undefined);
    } else {
      setUrl(data.cacheEntry.url);
      setMethod(data.cacheEntry.method);
      setCacheEntry(JSON.parse(data.cacheEntry.content.toString()));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadCacheEntry();
    }
  }, [router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Contenido del Cache" subtitle="Cache" />
        </div>
        <div></div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Cargando Cache" />
          <div className="ml-2 mt-1">Cargando Elemento del Cache</div>
        </div>
      ) : (
        <div>
          URL: {url}
          <br />
          Método: {method}
          <br />
          <br />
          Contenido:
          {cacheEntry && (
            <JsonView
              data={cacheEntry}
              shouldInitiallyExpand={allExpanded}
              style={darkStyles}
            />
          )}
        </div>
      )}
    </>
  );
};
export default Index;
