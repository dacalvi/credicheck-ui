import {IndicatorMultiRangeParameters} from "components/slider";
import {Result} from "constants/values";
import {Button} from "flowbite-react";
import {useState} from "react";
import {ResizableSliderSegmentEditor} from "./ResizableSliderSegmentEditor";

interface PercentOfGrowYoyParametersProps {
  onChange: any;
  defaultConfig: {
    segments: number[];
    segmentResults: Result[];
    resultScores: number[];
  };
}

const PercentOfGrowYoyParameters: React.FC<PercentOfGrowYoyParametersProps> = ({
  defaultConfig,
  onChange,
}) => {
  const [segments, setSegments] = useState<number[]>(defaultConfig.segments);
  const [segmentsStatus, setSegmentsStatus] = useState<Result[]>(
    defaultConfig.segmentResults
  );
  const [scores, setScores] = useState<number[]>(defaultConfig.resultScores);
  const addSegment = () => {
    //add a segment to the segments, the added segment should be the last segment plus 1
    const lastSegment = segments[segments.length - 1];
    setSegments([...segments, lastSegment + 1]);
    setSegmentsStatus([...segmentsStatus, Result.REJECT]);
  };

  const deleteSegment = (index: number) => {
    if (segments.length > 1) {
      //remove the element from the segments array at the index position
      if (index === 0) {
        setSegments(segments.filter((_, i) => i !== index));
        setSegmentsStatus(segmentsStatus.filter((_, i) => i !== index));
        setScores(scores.filter((_, i) => i !== index));
      } else if (index > 0 && index <= segments.length - 1) {
        setSegments(segments.filter((_, i) => i !== index));
        setSegmentsStatus(segmentsStatus.filter((_, i) => i !== index));
        setScores(scores.filter((_, i) => i !== index));
      } else {
        setSegments(segments.filter((_, i) => i !== index - 1));
        setSegmentsStatus(segmentsStatus.filter((_, i) => i !== index));
        setScores(scores.filter((_, i) => i !== index));
      }
    } else {
      alert("No se puede eliminar el ultimo segmento");
      //delete last segment
      setSegments(segments.filter((_, i) => i !== index));

      setSegmentsStatus(segmentsStatus.filter((_, i) => i !== index));
      setScores(scores.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <IndicatorMultiRangeParameters
        min={0}
        max={40}
        rangesValues={segments}
        rangeStates={segmentsStatus}
        onChange={(newsegments) => {
          if (typeof newsegments === "number") {
            newsegments = [newsegments];
          }
          setSegments(newsegments);
          onChange({
            segments: newsegments,
            segmentResults: segmentsStatus,
            resultScores: scores,
          });
        }}
      />

      <div className="mt-5 mb-5">
        {
          // eslint-disable-next-line react/no-array-index-key
          segments.map((segment, index) => (
            <ResizableSliderSegmentEditor
              key={index}
              index={index}
              onDelete={deleteSegment}
              canDelete={segments.length > 1}
              initialStatus={segmentsStatus[index]}
              initialScore={scores[index]}
              onChange={(data: any) => {
                const newSegmentsStatus = [...segmentsStatus];
                newSegmentsStatus[data.index] = data.result;
                setSegmentsStatus(newSegmentsStatus);
                const newScores = [...scores];
                newScores[data.index] = data.score;
                setScores(newScores);
                onChange({
                  segments,
                  segmentResults: newSegmentsStatus,
                  resultScores: newScores,
                });
              }}
              segments={segments}
            />
          ))
        }

        <ResizableSliderSegmentEditor
          key={segments.length}
          index={segments.length}
          onDelete={deleteSegment}
          canDelete={segments.length > 1}
          initialStatus={segmentsStatus[segments.length]}
          initialScore={scores[segments.length]}
          onChange={(data: any) => {
            const newSegmentsStatus = [...segmentsStatus];
            newSegmentsStatus[data.index] = data.result;
            setSegmentsStatus(newSegmentsStatus);
            const newScores = [...scores];
            newScores[data.index] = data.score;
            setScores(newScores);
            onChange({
              segments,
              segmentResults: newSegmentsStatus,
              resultScores: newScores,
            });
          }}
          segments={segments}
        />
      </div>

      <Button size="xs" onClick={addSegment}>
        Agregar un segmento
      </Button>
    </div>
  );
};

export {PercentOfGrowYoyParameters};
