import { apiUrl } from "@/lib/api";

export interface McqQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export async function fetchMcqQuestions(
  policyKey: string
): Promise<McqQuestion[]> {
  const response = await fetch(apiUrl(`/ans/${policyKey}`));

  if (!response.ok) {
    throw new Error(`Failed to fetch policy: ${response.statusText}`);
  }

  const json = await response.json();
  const mcqData = json?.result?.finalResult?.mcq?.questions;

  if (!Array.isArray(mcqData)) {
    throw new Error("MCQ data format is missing or invalid.");
  }

  return mcqData;
}
