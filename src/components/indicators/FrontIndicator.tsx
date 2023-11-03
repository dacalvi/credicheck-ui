/* eslint-disable no-console */
import ContentLoader from "react-content-loader";
import {SalesRevenue} from "./SalesRevenue";
import {SalesRevenue24} from "./SalesRevenue24";
import {YearsOfActivity} from "./YearsOfActivity";

interface FrontIndicatorsProps {
  step: any;
  index: number;
}

const FrontIndicator: React.FC<FrontIndicatorsProps> = ({step, index}) => {
  if (step.state === "PENDING") {
    return (
      <ContentLoader
        speed={2}
        width={476}
        height={124}
        viewBox="0 0 476 124"
        backgroundColor="#171717"
        foregroundColor="#262626">
        <rect x="0" y="0" rx="2" ry="2" width="140" height="10" />
        <rect x="0" y="20" rx="2" ry="2" width="180" height="55" />
      </ContentLoader>
    );
  }
  switch (step.indicator.associated_function) {
    case "years-of-activity":
      return <YearsOfActivity step={step} index={index} />;
    case "sales-revenue":
      return <SalesRevenue step={step} index={index} />;
    case "sales-revenue24":
      return <SalesRevenue24 step={step} index={index} />;
    default:
      console.log(step.indicator.associated_function);
      return null;
  }
};

export {FrontIndicator};
