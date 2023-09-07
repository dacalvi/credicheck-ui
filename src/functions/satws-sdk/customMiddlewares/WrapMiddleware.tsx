import {PrismaClient} from "@prisma/client";
import {generateUUID} from "functions/uuid";

const prisma = new PrismaClient();

const saveLog = async (options: any, status?: any) => {
  const requestLog = await prisma.requestLog.create({
    data: {
      url: (process.env.SAT_WS_URL + options.url) as string,
      method: options.method as string,
      body: options.body ? (options.body as unknown as string) : "",
      headers: options.headers ? JSON.stringify(options.headers) : "",
      stausCode: status,
      uuid: generateUUID(),
    },
  });
  return requestLog;
};

const saveCache = async (options: any, response: any, requestLogId: any) => {
  const content = await response.json();

  const cache = await prisma.queryCache.create({
    data: {
      url: (process.env.SAT_WS_URL + options.url) as string,
      method: options.method as string,
      content: content ? JSON.stringify(content) : "",
      headers: response.headers ? JSON.stringify(response.headers) : "",
      uuid: generateUUID(),
      requestLog: {
        connect: {
          id: requestLogId,
        },
      },
    },
  });
  return cache;
};

export class WrapMiddleware {
  public async process(options: any, next: any) {
    //default to get method
    if (options.method === undefined) {
      options.method = "GET";
    }
    const requestLog = await saveLog(options);
    const cacheFound = await prisma.queryCache.findFirst({
      where: {
        url: process.env.SAT_WS_URL + options.url,
        method: options.method,
      },
    });

    if (cacheFound) {
      if (requestLog) {
        //update requestLog set servedFromCache = true
        await prisma.requestLog.update({
          where: {
            id: requestLog.id,
          },
          data: {
            servedFromCacheUuid: cacheFound.uuid,
            servedFromCache: "CACHE",
            stausCode: 304, //304 status code means that the server is not sending the requested resource again because the client already has a current version of the resource in its cache
          },
        });
      }
      return JSON.parse(cacheFound.content);
    } else {
      return next(options).then(async (response: any) => {
        //clone response
        const clonedResponse = response.clone();
        if (requestLog) {
          const newCache = await saveCache(
            options,
            clonedResponse,
            requestLog.id
          );

          //update requestLog set servedFromCache = false
          await prisma.requestLog.update({
            where: {
              id: requestLog.id,
            },
            data: {
              servedFromCacheUuid: newCache.uuid,
              servedFromCache: "SERVER",
              stausCode: response.status,
            },
          });
        }
        return response.json();
      });
    }
  }
}
