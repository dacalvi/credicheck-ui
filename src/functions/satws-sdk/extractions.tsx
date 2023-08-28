import {Service} from "@crazyfactory/tinka";
import {ExtractionResponseType} from "./types/ExtractionResponseType";
import {ExtractorListType} from "./types/extractorType";
import {ExtractorOptionsType} from "./types/extractionOptions";

export class ExtractionsNode extends Service {
  public createExtraction(
    rfc: string,
    extractor: ExtractorListType[] | string,
    options: ExtractorOptionsType
  ): Promise<ExtractionResponseType> {
    return this.client.process({
      url: `/extractions`,
      method: "POST",
      body: JSON.stringify({
        taxpayer: `/taxpayers/${rfc}`,
        extractor: extractor,
        options: options,
      }),
    });
  }
}
