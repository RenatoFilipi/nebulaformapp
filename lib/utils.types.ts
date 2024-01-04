import type { Database } from "./database.types";

export type statusType = "isIdle" | "isLoading" | "isSuccess" | "isRejected";
export type signupStageType = "stageSignUpForm" | "stageVerifyEmail";
export type forgotPasswordStageType = "stageIsOnRequestForm" | "stageIsRequested";
export type updatePasswordStageType = "stageIsOnUpdateForm" | "stageIsUpdated";
export type elementQuestionType = "multipleChoice" | "openEnded" | "likertScale";

//supabase database types
export type SBformsType = Database["public"]["Tables"]["forms"]["Row"];
export type SBresponsesType = Database["public"]["Tables"]["responses"]["Row"];
