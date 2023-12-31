import type { elementQuestionType } from "./utils.types";

export interface editorFormProps {
  id: string;
  name: string;
  elements: elementProps[];
}
export interface elementProps {
  id: string;
  type: elementQuestionType;
  props: multipleChoiceProps | openEndedProps | likertScaleProps;
}

export interface multipleChoiceProps {
  question: string;
  description: string;
  options: { value: string; label: string }[];
}

export interface openEndedProps {
  question: string;
  description: string;
}

export interface likertScaleProps {
  question: string;
  description: string;
  lowestLabel: string;
  highestLabel: string;
}

export interface editorElementOptionProps {
  title: string;
  description: string;
  isAvailable: boolean;
  type: elementQuestionType;
}
