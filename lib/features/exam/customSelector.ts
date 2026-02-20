import { RootState } from "@/lib/store";

export const selectPerformanceBySubject = (state: RootState) => {
  const { questions, answers } = state.exam;

  const result: Record<
    string,
    { correct: number; total: number; percentage: number }
  > = {};

  questions.forEach((question) => {
    const subject = question.subject;

    if (!result[subject]) {
      result[subject] = {
        correct: 0,
        total: 0,
        percentage: 0,
      };
    }

    result[subject].total += 1;

    const userAnswer = answers.find((a) => a.questionId === question.id);

    if (!userAnswer) return;

    let isCorrect = false;

    if (question.question_type === "fill_in_the_blank") {
      isCorrect =
        userAnswer.selected.trim().toLowerCase() ===
        question.correct_answer.trim().toLowerCase();
    } else {
      isCorrect = userAnswer.selected === question.correct_answer;
    }

    if (isCorrect) {
      result[subject].correct += 1;
    }
  });

  // calculate percentages
  Object.keys(result).forEach((subject) => {
    const data = result[subject];
    data.percentage =
      data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  });

  return result;
};
