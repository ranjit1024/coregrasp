import {Hono} from "hono";
import {cors} from "hono/cors"
import { uplaod_Route } from "./route/uplaod";
import { result_Route } from "./route/result";
type Bindings = {
  PDF_BUCKET : R2Bucket
}

const app = new Hono<{Bindings: Bindings}>();

app.use('*', cors());


app.get("/", (c) => c.text('Working...'));

app.post('/uplaod-pdf', uplaod_Route );
app.get('/result', result_Route)

export default app;