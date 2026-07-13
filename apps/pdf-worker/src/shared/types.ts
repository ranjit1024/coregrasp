export type Bindings = {
  HYPERDRIVE: Hyperdrive;
  PDF_BUCKET: R2Bucket;
  PDF_QUEUE: Queue;
  AI: Ai;

};

export type PdfJob = {
  key: string;
  uploadedAt: string;
};

export interface MCQ {
    question: string;
    options: string[]; 
    correctIndex: number; 
    explanation?: string;
}

export interface MCQResult {
    questions: MCQ[];
    raw: string;
}