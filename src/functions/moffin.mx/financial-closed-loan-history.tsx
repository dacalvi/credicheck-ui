import {AssociatedFunctionResponseType} from "types/associatedFunctionResponse.type";
import {CommonPayloadType} from "types/commonPayload.type";
import {financialLoanHistoryMock} from "./mocks/financial-loan-history";

const isLessThan24MonthsAgo = (lastUpdatedPeriod: string) => {
  //convert lastUpdatedPeriod to date
  const lastUpdatedPeriodDate = new Date(
    Number(lastUpdatedPeriod.slice(0, 4)),
    Number(lastUpdatedPeriod.slice(4, 6))
  );
  //check if lastUpdatedPeriodDate is less than 24 months ago
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 24);
  const isLessThan24MonthsAgo =
    lastUpdatedPeriodDate.getTime() > sixMonthsAgo.getTime() &&
    lastUpdatedPeriodDate.getTime() < today.getTime();

  return isLessThan24MonthsAgo;
};

export const financialClosedLoanHistory = async (
  payload: CommonPayloadType
): Promise<AssociatedFunctionResponseType> => {
  try {
    /**
     * Situación creditos fin. a la fecha (mes 7 a 24) vigentes y cerrados
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
        if (isLessThan24MonthsAgo(creditoFinanciero.ultimoPeriodoActualizado)) {
          hasAtLeast1ActualLoan = true;
          //take the first 6 characters of creditoFinanciero.historicoPagos are "111111111111111111"

          const pagosAlDia =
            creditoFinanciero.historicoPagos.slice(7, 24) ===
            "111111111111111111";
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
