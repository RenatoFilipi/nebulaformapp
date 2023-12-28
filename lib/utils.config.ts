import type { editorElementOptionProps } from "./utils.interfaces";

export const editorElementOptions: editorElementOptionProps[] = [
  {
    title: "Multiple Choice",
    description: "Users choose from a list of predefined options. Useful for structured responses and easy analysis.",
    isAvailable: true,
    type: "multipleChoice",
  },
  {
    title: "Open Ended",
    description:
      "Allows respondents to provide detailed, free-text answers. Ideal for capturing nuanced opinions and specific feedback.",
    isAvailable: true,
    type: "openEnded",
  },
  {
    title: "Likert Scale",
    description:
      "Asks respondents to rate their agreement with a statement using a scale. Provides a quantitative measure of attitudes or opinions.",
    isAvailable: true,
    type: "likertScale",
  },
];

export const editorElementOptionsEnum = ["none", "multipleChoice", "openEnded", "likertScale"] as const;
