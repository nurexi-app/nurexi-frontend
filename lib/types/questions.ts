export type QuestionType =
  | "multiple_choice"
  | "mcq"
  | "select_all"
  | "true_false"
  | "scenario"
  | "fill_in_the_blank"
  | "calculation";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: string[];
  correct_answer: string;
  explanation: string;
  topics: string[];
  exam_types: ("NMCN" | string)[]; // Standard NMCN or other boards
  difficulty: DifficultyLevel;
  year_added: number;
  is_active: boolean;
  subject: string;
}
