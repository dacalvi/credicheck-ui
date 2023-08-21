import {useEffect, useState} from "react";
import {FiCheck, FiCircle, FiEye, FiEyeOff, FiSettings} from "react-icons/fi";
import {Dropdown} from "flowbite-react";
export type ChartSelectorProps = {
  id: number;
  heading: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  isChecked?: boolean;
  onChange: (id: number, checked: boolean) => void;
};

const ChartSelector: React.FC<ChartSelectorProps> = ({
  id,
  heading,
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
  }, []);

  const toggleChecked = () => {
    setChecked(!checked);
    onChange(id, !checked);
  };

  return (
    <div
      className={`mr-5 w-64 p-4 mb-4 rounded-lg  border border-gray-100 ${
        checked ? "bg-slate-600" : "dark:bg-gray-900"
      }  dark:border-gray-800`}>
      {(title || description) && (
        <div className="flex flex-row  align-top justify-between items-start">
          <div className="flex flex-col align-top h-20 ">
            {heading}

            <div className="text-sm font-bold mr-5">{description}</div>

            <div className="text-sm font-light text-gray-500 mr-5 mt-2">
              {description}
            </div>
          </div>
          <div className="flex flex-col align-top h-[130px] items-end justify-between">
            <div>
              <Dropdown label="" inline={true}>
                <Dropdown.Item onClick={toggleChecked}>
                  <div className="flex flex-row">
                    {checked && (
                      <div className="flex flex-row">
                        <div className="mr-2">
                          <FiEyeOff />
                        </div>
                        <div>Ocultar</div>
                      </div>
                    )}

                    {!checked && (
                      <div className="flex flex-row">
                        <div className="mr-2">
                          <FiEye />
                        </div>
                        <div>Mostrar</div>
                      </div>
                    )}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div className="flex flex-row">
                    <div className="mr-2">
                      <FiSettings />
                    </div>
                    <div>Cambiar parametros por defecto</div>
                  </div>
                </Dropdown.Item>
              </Dropdown>
            </div>
            {checked && (
              <FiCheck
                size={30}
                className="text-green-500 cursor-pointer"
                onClick={toggleChecked}
              />
            )}
            {!checked && (
              <FiCircle
                size={30}
                className="text-gray-500 cursor-pointer"
                onClick={toggleChecked}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartSelector;
