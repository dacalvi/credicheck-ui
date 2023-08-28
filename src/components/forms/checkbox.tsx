import {useState} from "react";

export type CheckboxProps = {
  name: string;
  label: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  checked,
  ...props
}) => {
  const defaultChecked = checked ? checked : false;
  const [isChecked, setIsChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center h-6">
        <input
          name={name}
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked((prev: any) => !prev)}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 form-checkbox focus:ring-blue-500"
          {...props}
        />
      </div>
      <div className="text-sm space-y-1">
        <div className="shrink-0 block font-medium text-gray-700 whitespace-nowrap dark:text-white">
          {label}
        </div>
      </div>
    </div>
  );
};
