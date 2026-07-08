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
export type GeiminmiResult = {
  summery: string,
  topics: string[],
  entities: string[],
  raw: string
}