"use client";

import { useState } from "react";
import BroadcastingLayout from "./broadcasting/BroadcastingLayout";
import RepresentativenessLayout from "./representativeness/RepresentativenessLayout";

const Main: React.FC = () => {
  const [toggleBroadcastingPage, setToggleBroadcastingPage] = useState(false);

  if (toggleBroadcastingPage) {
    return (
      <BroadcastingLayout
        setToggleBroadcastingPage={setToggleBroadcastingPage}
      ></BroadcastingLayout>
    );
  }
  return (
    <RepresentativenessLayout
      setToggleBroadcastingPage={setToggleBroadcastingPage}
    ></RepresentativenessLayout>
  );
};

export default Main;
