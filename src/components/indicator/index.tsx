import {useEffect, useState} from "react";
import {FiCheck, FiCircle} from "react-icons/fi";

export type IndicatorProps = {
  id: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  isChecked?: boolean;
  onChange: (id: number, checked: boolean) => void;
};

const Indicator: React.FC<IndicatorProps> = ({
  id,
  title,
  description,
  isChecked,
  onChange,
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isChecked) {
      setChecked(isChecked);
    } else {
      setChecked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleChecked = () => {
    setChecked(!checked);
    onChange(id, !checked);
  };

  return (
    <div
      onClick={toggleChecked}
      className={`mr-5 w-64 p-4 mb-4 rounded-lg  border border-gray-100 ${
        checked ? "bg-slate-600" : "dark:bg-gray-900"
      }  dark:border-gray-800`}>
      {(title || description) && (
        <div className="flex flex-row items-center align-top justify-between mb-6">
          <div className="flex flex-col align-top h-20">
            <div className="text-sm font-light text-gray-500 mr-5">{title}</div>

            <div className="text-sm font-bold mr-5">{description}</div>
          </div>
          <div className="flex flex-col align-top h-20">
            {checked && <FiCheck size={30} className="text-green-500" />}
            {!checked && <FiCircle size={30} className="text-gray-500" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Indicator;
