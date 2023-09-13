import {Service} from "@crazyfactory/tinka";
import {ExtractionResponseType} from "./types/ExtractionResponseType";
import {ExtractorListType} from "./types/extractorType";

export class ExtractionsNode extends Service {
  public createExtraction(
    rfc: string,
    extractor: ExtractorListType[] | string,
    options: any
  ): Promise<ExtractionResponseType> {
    return this.client.process({
      url: `/extractions`,
      method: "POST",
      body: {
        taxpayer: `/taxpayers/${rfc}`,
        extractor: extractor,
        options: options,
      },
    });
  }
}
