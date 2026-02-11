"use client";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

const AppContext = createContext<{
  examType: string;
  setExamType: Dispatch<SetStateAction<string>>;
  showResult: boolean;
  setShowResult: Dispatch<SetStateAction<boolean>>;
  showExplanation: boolean;
  setShowExplanation: Dispatch<SetStateAction<boolean>>;
  examDuration: number;
  setExamDuration: Dispatch<SetStateAction<number>>;
  answeredQuestionsProgress: number;
  setAnsweredQuestionsProgress: Dispatch<SetStateAction<number>>;
} | null>(null);

function AppProvider({ children }: { children: React.ReactNode }) {
  const [examType, setExamType] = useState<string>("all");
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [examDuration, setExamDuration] = useState<number>(60 * 60);
  const [answeredQuestionsProgress, setAnsweredQuestionsProgress] =
    useState<number>(0);
  return (
    <AppContext.Provider
      value={{
        examType,
        setExamType,
        showResult,
        setShowResult,
        showExplanation,
        setShowExplanation,
        examDuration,
        setExamDuration,
        answeredQuestionsProgress,
        setAnsweredQuestionsProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
