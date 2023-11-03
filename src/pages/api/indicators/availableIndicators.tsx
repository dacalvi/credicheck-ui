//import {taxComplianceCheck} from "constants/indicators/tax-compliance-check";
import {yearsOfActivity} from "constants/indicators/years-of-activity";
import {salesRevenue} from "constants/indicators/sales-revenue";
import {salesRevenue24} from "constants/indicators/sales-revenue24";
//import {blackListStatus} from "constants/indicators/black-list-status";
//import {percentBigClientsConcentration} from "constants/indicators/percent-big-clients-concentration";
//import {percentOfGrowYoy} from "constants/indicators/percent-of-grow-yoy";

const availableIndicators = {
  indicators: [
    yearsOfActivity,
    salesRevenue,
    salesRevenue24,
    /*
    taxComplianceCheck,
    blackListStatus,
    percentBigClientsConcentration,
    percentOfGrowYoy,
    */
  ],
};

export default availableIndicators;
