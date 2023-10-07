import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";
import {financialLoanHistoryMock} from "./mocks/financial-loan-history";

const isLessThanSixMonthsAgo = (lastUpdatedPeriod: string) => {
  //convert lastUpdatedPeriod to date
  const lastUpdatedPeriodDate = new Date(
    Number(lastUpdatedPeriod.slice(0, 4)),
    Number(lastUpdatedPeriod.slice(4, 6))
  );
  //check if lastUpdatedPeriodDate is less than 6 months ago
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const isLessThanSixMonthsAgo =
    lastUpdatedPeriodDate.getTime() > sixMonthsAgo.getTime() &&
    lastUpdatedPeriodDate.getTime() < today.getTime();

  return isLessThanSixMonthsAgo;
};

export const financialLoanHistory = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    /**
     * Situación creditos fin. a la fecha (los últimos 6 meses) vigentes y cerrados
     */

    /*
    const sdk = MoffinSdk.getInstance(
      payload.moffin_mx_url,
      payload.moffin_mx_api_key
    );
        */

    let hasAtLeast1ActualLoan = false;
    let hasEveryActualLoanProperlyPaid = true;

    financialLoanHistoryMock.response.respuesta.creditoFinanciero.forEach(
      (creditoFinanciero) => {
        if (
          isLessThanSixMonthsAgo(creditoFinanciero.ultimoPeriodoActualizado)
        ) {
          hasAtLeast1ActualLoan = true;
          //take the first 6 characters of creditoFinanciero.historicoPagos are "111111"

          const pagosAlDia =
            creditoFinanciero.historicoPagos.slice(0, 6) === "111111";
          if (!pagosAlDia) {
            hasEveryActualLoanProperlyPaid = false;
          }
        }
      }
    );

    if (hasAtLeast1ActualLoan && hasEveryActualLoanProperlyPaid) {
      return {
        processId: payload.processId,
        uuid: payload.uuid,
        result: "SKIP",
        score: 100,
        result_explanation: `Tiene al menos un credito vigente y todos los creditos vigentes estan al dia`,
      };
    } else {
      return {
        processId: payload.processId,
        uuid: payload.uuid,
        result: "REJECT",
        score: 0,
        result_explanation: `No tiene al menos un credito vigente o no todos los creditos vigentes estan al dia`,
      };
    }
  } catch (error) {
    return null;
  }
};
