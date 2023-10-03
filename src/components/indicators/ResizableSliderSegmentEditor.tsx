import {Result} from "constants/values";
import {Label, Button, TextInput} from "flowbite-react";
import {useState} from "react";
import {FiTrash2} from "react-icons/fi";

interface ResizableSliderSegmentEditorProps {
  index: number;
  onDelete?: any;
  onChange?: any;
  initialStatus?: Result;
  initialScore?: number;
  segments: number[];
  canDelete?: boolean;
}

const ResizableSliderSegmentEditor: React.FC<
  ResizableSliderSegmentEditorProps
> = ({
  index,
  onDelete,
  onChange,
  initialStatus,
  initialScore,
  segments,
  canDelete = true,
}) => {
  //crete a state called status with type Result
  const [status, setStatus] = useState<Result>(initialStatus || Result.REJECT);
  const [score, setScore] = useState<number>(initialScore || 0);

  const handleDelete = () => {
    onDelete(index);
  };

  return (
    <div>
      <div className="flex flex-row">
        {status === Result.REJECT && (
          <div className="h-24 w-1 mr-5 mt-3 bg-[#f00]"></div>
        )}
        {status === Result.MANUAL && (
          <div className="h-24 w-1 mr-5 mt-3 bg-[#d97706]"></div>
        )}
        {status === Result.SKIP && (
          <div className="h-24 w-1 mr-5 mt-3 bg-[#059669]"></div>
        )}
        <div className="flex flex-col">
          <div className="flex flex-row mt-2">
            <div className="flex flex-col mr-5">
              <Label htmlFor="test" value="Resultado" />
              <Button.Group id="3">
                <Button
                  size="xs"
                  color="red"
                  onClick={() => {
                    setStatus(Result.REJECT);
                    onChange({index, result: Result.REJECT, score});
                  }}>
                  Rechazo
                </Button>
                <Button
                  size="xs"
                  color="yellow"
                  onClick={() => {
                    setStatus(Result.MANUAL);
                    onChange({index, result: Result.MANUAL, score});
                  }}>
                  Manual
                </Button>
                <Button
                  size="xs"
                  color="green"
                  onClick={() => {
                    setStatus(Result.SKIP);
                    onChange({index, result: Result.SKIP, score});
                  }}>
                  Aprobar
                </Button>
              </Button.Group>
            </div>

            <div className="flex flex-col mr-5">
              <Label htmlFor="test" value="Score" />
              <TextInput
                name="test"
                type="text"
                sizing="sm"
                value={score}
                onChange={(e) => {
                  setScore(Number(e.target.value));
                  onChange({
                    index,
                    result: status,
                    score: Number(e.target.value),
                  });
                }}
              />
            </div>
            {canDelete && (
              <div>
                <FiTrash2
                  size={20}
                  className="mt-6 cursor-pointer"
                  onClick={() => {
                    handleDelete();
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-1 text-xs">
            {index < 1
              ? `Si la cantidad de años de actividad es menor a ${
                  segments[0]
                } el resultado va a ser ${
                  status === Result.REJECT
                    ? "Rechazo"
                    : status === Result.MANUAL
                    ? "Manual"
                    : "Aprobado"
                } con un score de ${score}`
              : ""}

            {index > 0 && index < segments.length
              ? `Si la cantidad de años de actividad es mayor a ${
                  segments[index - 1]
                } y menor a ${segments[index]}, el resultado sera de ${
                  status === Result.REJECT
                    ? "Rechazo"
                    : status === Result.MANUAL
                    ? "Manual"
                    : "Aprobado"
                } con un score de ${score}`
              : ""}

            {index === segments.length
              ? `Si la cantidad de años de actividad es mayor a ${
                  segments[index - 1]
                }, el resultado sera de ${
                  status === Result.REJECT
                    ? "Rechazo"
                    : status === Result.MANUAL
                    ? "Manual"
                    : "Aprobado"
                } con un score de ${score}`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export {ResizableSliderSegmentEditor};
