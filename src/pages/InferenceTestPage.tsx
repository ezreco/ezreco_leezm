import React from "react";
import InferenceView from "../components/InferenceView";

const InferenceTestPage: React.FC = () => {
  return (
    <div className="w-screen h-screen">
      <InferenceView onComplete={() => console.log("Inference complete")} />
    </div>
  );
};

export default InferenceTestPage;