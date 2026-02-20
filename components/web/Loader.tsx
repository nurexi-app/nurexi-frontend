"use client";
import { CSSProperties } from "react";
import { ClimbingBoxLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  //   borderColor: "red",
};
const Loader = () => {
  return (
    <ClimbingBoxLoader
      color="#36d7b7"
      loading={true}
      cssOverride={override}
      size={20}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loader;
