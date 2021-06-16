import Vue from "vue";
import VueRouter from "vue-router";

//Adding layouts router.
const Layout1 = () => import("@/layouts/backend/Layout-1");

//Adding page content router.
const Dashboard = () => import("@/views/backend/Dashboards/Dashboard");

Vue.use(VueRouter);

const childRoute = () => [
  {
    path: "",
    name: "layout.dashboard1",
    meta: { name: "Dashboard1" },
    component: Dashboard,
  },
];

const routes = [
  {
    path: "/",
    name: "",
    component: Layout1,
    children: childRoute(),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.VUE_APP_BASE_URL,
  routes,
});

export default router;
