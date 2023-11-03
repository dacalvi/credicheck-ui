interface SalesRevenue24Props {
  step: any;
  index: number;
}

const SalesRevenue24: React.FC<SalesRevenue24Props> = ({step}) => {
  return (
    <div>
      <div className="mx-2 mb-10">
        <div className="max-w-[200px] h-12">{step.name}</div>
        {step.state === "PENDING" ? (
          <div className="rounded-md w-48 h-16">{step.resultExplanation}</div>
        ) : step.result === "SKIP" ? (
          <div className="rounded-md w-48 h-16 bg-green-300 text-black flex items-center justify-center text-xl font-extrabold">
            ${Math.trunc(step.resultExplanation)}
          </div>
        ) : step.result === "MANUAL" ? (
          <div className="rounded-md w-48 h-16 bg-lime-300 text-black flex items-center justify-center text-xl font-extrabold">
            ${Math.trunc(step.resultExplanation)}
          </div>
        ) : step.result === "REJECT" ? (
          <div className="rounded-md w-48 h-16 bg-red-400 text-black p-3 text-black flex items-center justify-center text-xl font-extrabold">
            ${Math.trunc(step.resultExplanation)}
          </div>
        ) : null}
        <small>Score: {step.score}</small>
      </div>
    </div>
  );
};

export {SalesRevenue24};
