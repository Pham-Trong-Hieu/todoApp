import authRoute from "./authRoute";
import taskRoute from "./taskRoute"
import commentRoute from "./commentRoute"
const initApiRoutes = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/task", taskRoute);
  app.use("/api/v1/comment", commentRoute);

};

export default initApiRoutes;
