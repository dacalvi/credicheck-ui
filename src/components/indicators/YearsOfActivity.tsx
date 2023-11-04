interface YearsOfActivityProps {
  step: any;
  index: number;
}

const YearsOfActivity: React.FC<YearsOfActivityProps> = ({step}) => {
  return (
    <div>
      <div className="mx-2 mb-10">
        <div className="max-w-[200px] h-12">{step.name}</div>
        {step.result === "SKIP" ? (
          <div className="rounded-md w-48 h-16 bg-green-300 text-black flex items-center justify-center text-2xl font-extrabold">
            {step.resultExplanation}
          </div>
        ) : step.result === "MANUAL" ? (
          <div className="rounded-md w-48 h-16 bg-lime-300 text-black flex items-center justify-center text-2xl font-extrabold">
            {step.resultExplanation}
          </div>
        ) : step.result === "REJECT" ? (
          <div className="rounded-md w-48 h-16 bg-red-400 text-black p-3 text-black flex items-center justify-center text-2xl font-extrabold">
            {step.resultExplanation}
          </div>
        ) : null}
        <small>Score: {step.score}</small>
      </div>
    </div>
  );
};

export {YearsOfActivity};
