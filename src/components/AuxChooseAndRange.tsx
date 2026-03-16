import React from "react";
import AuxChooseInput from "./AuxChooseInput";
import AuxRangeInput from "./AuxRangeInput";

interface ChooseOption {
  id: string;
  label: string;
  onClick?: () => void;
}

interface RangeValue {
  id?: string;
  label: string;
  value: number;
}

interface AuxChooseAndRangeProps {
  // AuxChooseInput props
  chooseOptions: ChooseOption[];
  onOptionClick?: (label: string) => void;
  onChooseSend?: () => void;
  onDirectInput?: (value: string) => void;
  onMultiSelect?: (selectedIds: string[]) => void;
  alwaysShowChooseSend?: boolean;
  hideChooseRightButton?: boolean;
  chooseContainerWidth?: number;

  // AuxRangeInput props
  rangeValues: RangeValue[];
  selectedRange: [number, number];
  onRangeChange: (range: [number, number]) => void;
  onRangeSend?: () => void;
  onRangeSelect?: (rangeText: string) => void;
}

const AuxChooseAndRange: React.FC<AuxChooseAndRangeProps> = ({
  chooseOptions,
  onOptionClick,
  onChooseSend,
  onDirectInput,
  onMultiSelect,
  alwaysShowChooseSend = false,
  hideChooseRightButton = false,
  chooseContainerWidth,
  rangeValues,
  selectedRange,
  onRangeChange,
  onRangeSend,
  onRangeSelect,
}) => {
  return (
    <div className="flex flex-col gap-[24px] w-full">
      {/* AuxChooseInput */}
      <AuxChooseInput
        options={chooseOptions}
        onOptionClick={onOptionClick}
        onSend={onChooseSend}
        onDirectInput={onDirectInput}
        onMultiSelect={onMultiSelect}
        alwaysShowSend={alwaysShowChooseSend}
        hideRightButton={hideChooseRightButton}
        containerWidth={chooseContainerWidth}
      />

      {/* AuxRangeInput */}
      <AuxRangeInput
        values={rangeValues}
        selectedRange={selectedRange}
        onRangeChange={onRangeChange}
        onSend={onRangeSend}
        onRangeSelect={onRangeSelect}
      />
    </div>
  );
};

export default AuxChooseAndRange;
