import {Hono} from "hono";
import {cors} from "hono/cors"
import { uplaod_Route } from "./route/uplaod";
import { result_Route } from "./route/result";
import { Bindings } from "hono/types";
import { get_url } from "./route/answer";
import { send_quiz } from "./route/send-quiz";
import { update_score } from "./route/update";
import { notification_list_Route, notification_read_Route, notification_ws_Route } from "./route/notification";
export { NotificationHub } from "../../lib/notification-hub";

const app = new Hono<{ Bindings: Bindings}>();
app.use('*', cors());
app.get("/", (c) => c.text('Working...'));
app.post('/uplaod-pdf',  uplaod_Route );
app.get('/ans/:url', get_url);
app.get('/result', result_Route);
app.post("/send-quiz", send_quiz);
app.post('/update-score', update_score);
app.get('/notifications/ws', notification_ws_Route);
app.get('/notifications', notification_list_Route);
app.post('/notifications/:id/read', notification_read_Route);

export default app;