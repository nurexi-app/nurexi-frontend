import { Question } from "@/lib/types/questions";
import { createSlice } from "@reduxjs/toolkit";

interface ExamState {
  examType: string;
  mode: "exam" | "learning";
  status: "idle" | "in-progress" | "review" | "completed";
  showResult: boolean;
  score?: {
    correct: number;
    total: number;
    percentage: number;
  };
  showExplanation: boolean;
  duration: number;
  progress: number;
  questions: Question[] | [];
  currentQuestionIndex: number;
  answers: {
    questionId: string;
    selected: string;
  }[];

  startedAt: number | null;
}

const initialState: ExamState = {
  examType: "all",
  mode: "exam",
  status: "idle",
  score: {
    correct: 0,
    total: 0,
    percentage: 0,
  },
  showResult: false,
  showExplanation: false,
  duration: 60 * 60, // seconds
  progress: 0,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  startedAt: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    startExam: (state, action) => {
      state.examType = action.payload;
      state.status = "in-progress";
      state.showResult = false;
      state.showExplanation = false;
      state.progress = 0;
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.startedAt = Date.now();
    },
    submitExam: (state) => {
      state.status = "completed";

      const correctAnswers = state.answers.filter((answer) => {
        const question = state.questions.find(
          (q) => q.id === answer.questionId,
        );

        if (!question) return false;

        if (question.question_type === "fill_in_the_blank") {
          return (
            answer.selected.trim().toLowerCase() ===
            question.correct_answer.trim().toLowerCase()
          );
        }

        return answer.selected === question.correct_answer;
      }).length;

      state.score = {
        correct: correctAnswers,
        total: state.questions.length, // or use points if exam type is different
        percentage: Math.round((correctAnswers / state.questions.length) * 100),
      };

      state.showResult = true;
    },

    setExamType: (state, action) => {
      state.examType = action.payload;
    },
    setShowResult: (state, action) => {
      state.showResult = action.payload;
    },
    setShowExplanation: (state, action) => {
      state.showExplanation = action.payload;
    },
    setExamDuration: (state, action) => {
      state.duration = action.payload;
    },
    setAnsweredQuestionsProgress: (state, action) => {
      state.progress = action.payload;
    },

    setExamStatus: (state, action) => {
      state.status = action.payload;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    setPreviousQuestion: (state) => {
      if (state.currentQuestionIndex === 0) return;
      state.currentQuestionIndex -= 1;
    },
    setNextQuestion: (state) => {
      if (state.currentQuestionIndex === state.questions.length - 1) {
        return;
      }
      state.currentQuestionIndex += 1;
    },
    setAnswers: (state, action) => {
      const existingAnswer = state.answers.find(
        (answer) => answer.questionId === action.payload.questionId,
      );
      if (existingAnswer) {
        existingAnswer.selected = action.payload.selected;
      } else {
        state.answers.push(action.payload);
      }
    },
    restartExam: (state) => {
      state.status = "in-progress";
      state.showResult = false;
      state.showExplanation = false;
      state.progress = 0;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.startedAt = Date.now();
      state.score = {
        correct: 0,
        total: 0,
        percentage: 0,
      };
    },
    reviewExam: (state) => {
      state.status = "review";
      state.currentQuestionIndex = 0;
    },
    endExam: (state) => {
      state.examType = "all";
      state.duration = 60 * 60;
      state.status = "idle";
      state.showResult = false;
      state.showExplanation = false;
      state.progress = 0;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.startedAt = null;
      state.score = {
        correct: 0,
        total: 0,
        percentage: 0,
      };
    },
  },
});

export const {
  startExam,
  setExamType,
  setShowResult,
  setShowExplanation,
  setExamDuration,
  setAnsweredQuestionsProgress,
  setExamStatus,
  setQuestions,
  setCurrentQuestionIndex,
  setPreviousQuestion,
  setNextQuestion,
  setAnswers,
  restartExam,
  submitExam,
  reviewExam,
  endExam,
} = examSlice.actions;
export default examSlice.reducer;
