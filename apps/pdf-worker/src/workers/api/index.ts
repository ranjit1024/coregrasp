import { Hono } from "hono";
import { cors } from "hono/cors";
import { uplaod_Route } from "./route/uplaod";
import { result_Route } from "./route/result";
import { get_url } from "./route/answer";
import { send_quiz } from "./route/send-quiz";
import { update_score } from "./route/update";
import { notification_list_Route, notification_read_Route, notification_ws_Route } from "./route/notification";
import { requireUser, ApiVariables } from "./middleware/auth";
import { Bindings } from "../../shared/types";
export { NotificationHub } from "../../lib/notification-hub";

const app = new Hono<{ Bindings: Bindings; Variables: ApiVariables }>();

// Auth is a bearer token (never a cookie), so a wildcard origin does not
// enable CSRF; the Authorization header is what gates access.
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
}));

app.get("/", (c) => c.text('Working...'));

// Public: quiz content for candidates and anonymous score submission.
app.get('/ans/:url', get_url);
app.post('/update-score', update_score);

// Requires a signed worker token (see ./middleware/auth.ts).
app.post('/uplaod-pdf', requireUser, uplaod_Route);
app.get('/result', requireUser, result_Route);
app.post("/send-quiz", requireUser, send_quiz);
app.get('/notifications/ws', requireUser, notification_ws_Route);
app.get('/notifications', requireUser, notification_list_Route);
app.post('/notifications/:id/read', requireUser, notification_read_Route);

export default app;
