import {PrismaClient} from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    return await authenticateCiec(req, res);
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}

async function authenticateCiec(req: any, res: any) {
  const data = req.body;

  // eslint-disable-next-line no-console
  console.log(data);

  data.type = "ciec";
  const url = `${process.env.SAT_WS_URL}/credentials`;
  const headers = {
    "X-API-KEY": process.env.SAT_WS_API_KEY,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, data, {headers});

    // eslint-disable-next-line no-console
    console.log(response.data);

    if (response.status !== 202)
      return res.status(200).json({message: "Error", success: false});

    if (response.status === 202) {
      //update the client satwsid field with the ciec id

      //get tax-status from satws
      const u = `${process.env.SAT_WS_URL}/taxpayers/${data.rfc}/tax-status`;
      // eslint-disable-next-line no-console
      console.log(u);

      const r = await axios.get(u, {headers});

      // eslint-disable-next-line no-console
      console.log(r.data["hydra:member"][0].address);

      //generate a profile in moffin.mx with the data from satws
      const profile = {
        email: r.data["hydra:member"][0].email,
        firstName: r.data["hydra:member"][0].person.firstName,
        middleName: r.data["hydra:member"][0].person.middleName,
        rfc: r.data["hydra:member"][0].rfc,
        basicRFC: r.data["hydra:member"][0].rfc.substring(0, 10),
        firstLastName: r.data["hydra:member"][0].person.middleName,
        secondLastName: r.data["hydra:member"][0].person.lastName,
        // address is streetType + streetName + exteriorNumber + interiorNumber
        address:
          r.data["hydra:member"][0].address.streetType +
          " " +
          r.data["hydra:member"][0].address.streetName +
          " " +
          r.data["hydra:member"][0].address.streetNumber +
          " " +
          r.data["hydra:member"][0].address.buildingNumber,
        city: r.data["hydra:member"][0].address.locality,
        state: r.data["hydra:member"][0].address.state,
        zipCode: r.data["hydra:member"][0].address.postalCode,
        nationality: "MX",
        exteriorNumber: r.data["hydra:member"][0].address.streetNumber,
        interiorNumber: r.data["hydra:member"][0].address.buildingNumber,
        neighborhood: r.data["hydra:member"][0].address.neighborhood,
        municipality: r.data["hydra:member"][0].address.locality,
        accountType: "PF",
        country: "MX",
      };

      // eslint-disable-next-line no-console
      console.log("profile", profile);

      /*
      const headers2 = {
        Authorization:
          "Token 15fecdc2c8300e7655ec40c3abff1af33ef00d889521fcb5e3012c6fc2cb1dcb",
        "Content-Type": "application/json",
      };
      */

      /*
      const profileResponse = await axios.post(
        `${process.env.MOFFIN_WS_URL}/profiles`,
        profile, //profile
        {headers: headers2}
      );
      */

      // eslint-disable-next-line no-console
      //console.log(profileResponse.data);

      await prisma.client.update({
        where: {
          uuid: req.body.uuid,
        },
        data: {
          satwsid: response.data.id,
        },
      });

      //remove password from response
      delete response.data.password;

      return res
        .status(200)
        .json({message: "Success", success: true, response: response.data});
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }

  return res.status(200).json({message: "Success", success: true});
}