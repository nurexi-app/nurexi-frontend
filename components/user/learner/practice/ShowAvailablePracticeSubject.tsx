"use client";
import { useState } from "react";
import PracticeInstructions from "./PracticeInstructions";
import PracticeCard from "./PracticeCard";

interface SubjectWithCount {
  id: number;
  name: string;
  questionCount: number;
}

const ShowAvailablePracticeSubject = ({
  subjectsObject,
}: {
  subjectsObject: SubjectWithCount[];
}) => {
  const [showSubject, setShowSubject] = useState(true);

  function handleToggle(): void {
    setShowSubject(!showSubject);
  }
  return showSubject ? (
    <PracticeInstructions onToggle={handleToggle} />
  ) : (
    <div className="grid grid-cols-2 mt-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {subjectsObject.map((subject, index) => (
        <PracticeCard key={index} {...subject} />
      ))}
    </div>
  );
};

export default ShowAvailablePracticeSubject;
