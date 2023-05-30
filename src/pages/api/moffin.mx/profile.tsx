//import {getToken} from "next-auth/jwt";

import axios from "axios";

export default async function handler(req: any, res: any) {
  //const token = await getToken({req});
  if (req.method === "POST") {
    /*
    if (!token) {
      return res.status(401).json({message: "Unauthorized", success: false});
    }
    */

    const data = req.body;
    // eslint-disable-next-line no-console
    console.log(data);

    /*
    const data2 = {
      email: "maestela@moffin.mx",
      firstName: "MA",
      middleName: "ESTELA",
      rfc: "AESE500614JK1",
      basicRFC: "AESE500614",
      firstLastName: "ARENAS",
      secondLastName: "SANCHEZ",
      address: "ZARAGOZA OTE NO 15-A",
      city: "TLAXCALA",
      state: "TLA",
      zipCode: "90500",
      nationality: "MX",
      exteriorNumber: "",
      interiorNumber: "",
      neighborhood: "HUAMANTLA",
      municipality: "",
      accountType: "PF",
      country: "MX",
    };
    */

    const data2 = {
      email: "victoria.acosta@gmail.com",
      firstName: "Elvira Cárdenas",
      middleName: "de",
      rfc: "ANYG660209IG3",
      basicRFC: "ANYG660209",
      firstLastName: "de",
      secondLastName: "Jesús",
      address: "Circuito Travesía Beatriz 1713 176",
      city: "L' Saldaña de Ulla",
      state: "Michoacán",
      zipCode: "10090",
      nationality: "MX",
      exteriorNumber: "1713",
      interiorNumber: "176",
      neighborhood: "Travessera Jorge",
      municipality: "L' Saldaña de Ulla",
      accountType: "PF",
      country: "MX",
    };

    //create an axios request to moffin.mx adding the header with the token
    const url = `${process.env.MOFFIN_WS_URL}/profiles`;

    // eslint-disable-next-line no-console
    console.log("url", url);

    const headers = {
      Authorization:
        "Token 15fecdc2c8300e7655ec40c3abff1af33ef00d889521fcb5e3012c6fc2cb1dcb",
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, data2, {headers});

      // eslint-disable-next-line no-console
      console.log(response.data);

      // eslint-disable-next-line no-console
      console.log("status", response.status);

      if (response.status !== 201) {
        return res
          .status(200)
          .json({message: "Error", success: false, data: response.data});
      } else {
        return res
          .status(200)
          .json({message: "Success", success: true, data: response.data});
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res
        .status(200)
        .json({message: "Error", success: false, data: error});
    }
  } else {
    return res
      .status(405)
      .json({message: "Method not allowed", success: false});
  }
}
