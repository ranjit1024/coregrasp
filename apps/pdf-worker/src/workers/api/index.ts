import {Hono} from "hono";
import {cors} from "hono/cors"
import { uplaod_Route } from "./route/uplaod";
import { result_Route } from "./route/result";
import { PrismaClient } from "@revisly/db/index";
import { PrismaPg } from "@prisma/adapter-pg";

type Env = {
  Bindings: {
    DATABASE_URL: string;
    PDF_BUCKET: R2Bucket;
    PDF_QUEUE: Queue;
  };
};

export function createPrismaClient(databaseUrl: string) {
  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
}



const app = new Hono<{ Bindings: Env["Bindings"] }>();


app.use('*', cors());


app.get("/", (c) => c.text('Working...'));

app.post('/uplaod-pdf',  uplaod_Route );
app.get('/result', result_Route)

export default app;