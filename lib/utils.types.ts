import type { Database } from "./database.types";

export type statusType = "isIdle" | "isLoading" | "isSuccess" | "isRejected";
export type signupStageType = "stageSignUpForm" | "stageVerifyEmail";
export type forgotPasswordStageType = "stageIsOnRequestForm" | "stageIsRequested";
export type updatePasswordStageType = "stageIsOnUpdateForm" | "stageIsUpdated";
export type elementQuestionType = "multipleChoice" | "openEnded" | "likertScale";

//supabase database types
export type SBformsType = Database["public"]["Tables"]["forms"]["Row"];
export type SBresponsesType = Database["public"]["Tables"]["responses"]["Row"];
export type SBquestionsType = Database["public"]["Tables"]["questions"]["Row"];
export type SBquestionMultipleChoiceType = Database["public"]["Tables"]["questions_multiple_choice"]["Row"];
export type SBquestionLikertScaleType = Database["public"]["Tables"]["questions_likert_scale"]["Row"];
