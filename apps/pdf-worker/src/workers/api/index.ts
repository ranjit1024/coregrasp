import {Hono} from "hono";
import {cors} from "hono/cors"
import { uplaod_Route } from "./route/uplaod";
import { result_Route } from "./route/result";
import { Bindings } from "hono/types";
import { get_url } from "./route/answer";
import { send_quiz } from "./route/send-quiz";
const app = new Hono<{ Bindings: Bindings}>();
app.use('*', cors());
app.get("/", (c) => c.text('Working...'));
app.post('/uplaod-pdf',  uplaod_Route );
app.post('/ans/:id', get_url)
app.get('/result', result_Route);
app.post("/send", send_quiz);
export default app;