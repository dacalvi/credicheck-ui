import SectionTitle from "components/section-title";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Spinner, Table} from "flowbite-react";
import {Badge} from "components/badges";
import {PiWebhooksLogo} from "react-icons/pi";
import {FiPlus} from "react-icons/fi";
import Widget from "components/widget";

type WebHook = {
  "@id": string;
  "@type": string;
  id: string;
  url: string;
  events: string[];
  convertToUnicode: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

const Index: React.FC = () => {
  const {status} = useSession();
  const router = useRouter();

  const [webhooklist, setWebhookList] = useState<WebHook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadWebhooklist = async () => {
    setLoading(true);
    const response = await fetch(process.env.VERCEL_URL + "/api/webhooks");
    const data = await response.json();
    setWebhookList(data.webhooks);
    setLoading(false);
  };

  const webhooksavailable = [
    "*",
    "credential.created",
    "credential.updated",
    "link.created",
    "link.updated",
    "extraction.created",
    "extraction.updated",
    "invoice.created",
    "invoice.updated",
    "invoice_payment.created",
    "invoice_payment.updated",
    "tax_return.created",
    "tax_return.update",
    "export.created",
    "export.updated",
    "tax_status.created",
    "tax_status.updated",
    "tax_compliance_check.created",
    "tax_compliance_check.updated",
    "tax_retention.created",
    "tax_retention.updated",
    "electronic_accounting_record.created",
    "electronic_accounting_record.updated",
    "file.created",
  ];

  const changeWebhookStatus = async (
    id: string,
    url: string,
    events: string[],
    enabled: boolean
  ) => {
    setLoading(true);

    const payload = {
      url: url,
      events: events,
      enabled: enabled,
    };

    // eslint-disable-next-line no-console
    console.log(payload);

    const fetchResponse = (await fetch(
      process.env.VERCEL_URL + "/api/webhooks/" + id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )) as any;
    const data = await fetchResponse.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setLoading(false);
    loadWebhooklist();
  };

  const deleteWebhook = async (id: string) => {
    setLoading(true);

    const fetchResponse = (await fetch(
      process.env.VERCEL_URL + "/api/webhooks/" + id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )) as any;
    const data = await fetchResponse.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setLoading(false);
    loadWebhooklist();
  };

  const addWebhook = async (event: string) => {
    setLoading(true);

    const fetchResponse = (await fetch(
      process.env.VERCEL_URL + "/api/webhooks/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: event,
        }),
      }
    )) as any;
    const data = await fetchResponse.json();
    // eslint-disable-next-line no-console
    console.log(data);
    setLoading(false);
    loadWebhooklist();
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    } else {
      loadWebhooklist();
    }
  }, [router, status]);

  return (
    <>
      <div className="flex justify-between mb-8">
        <div>
          <SectionTitle title="Listado de Webhooks" subtitle="Webhooks" />
        </div>
        <div></div>
      </div>

      {loading ? (
        <div className="flex">
          <Spinner color="info" aria-label="Cargando Cache" />
          <div className="ml-2 mt-1">Cargando Webhooks</div>
        </div>
      ) : (
        <>
          <Widget description="Agregar Webhook">
            {webhooksavailable.map((webhook, key) => {
              return (
                <Badge
                  key={key}
                  size="sm"
                  color={"bg-emerald-400  text-black"}
                  rounded
                  classNames="mx-2 my-2 cursor-pointer">
                  <PiWebhooksLogo className="inline-block w-5 h-5 mr-1 my-2" />
                  <span className="mt-3 mb-1">{webhook}</span>
                  <FiPlus
                    className="inline-block w-5 h-5 ml-1 mt-2"
                    onClick={() => {
                      addWebhook(webhook);
                    }}
                  />
                </Badge>
              );
            })}
          </Widget>
          <Widget description="Listado de Webhooks">
            <Table>
              <Table.Head>
                <Table.HeadCell>Url</Table.HeadCell>
                <Table.HeadCell>Eventos</Table.HeadCell>
                <Table.HeadCell>Estado</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {webhooklist.map((webhook, key) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={key}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {webhook.url}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {webhook.events}
                    </Table.Cell>
                    <Table.Cell align="right">
                      <div className="flex flex-row ">
                        {webhook.enabled ? (
                          <Button
                            onClick={() =>
                              changeWebhookStatus(
                                webhook.id,
                                webhook.url,
                                webhook.events,
                                false
                              )
                            }
                            className="">
                            Deshabilitar
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              changeWebhookStatus(
                                webhook.id,
                                webhook.url,
                                webhook.events,
                                true
                              )
                            }
                            className="">
                            Habilitar
                          </Button>
                        )}

                        <Button
                          onClick={() => deleteWebhook(webhook.id)}
                          className="ml-5">
                          Eliminar
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Widget>
        </>
      )}
    </>
  );
};
export default Index;
