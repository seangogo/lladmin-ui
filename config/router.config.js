export default [
  // user
  {
    path: '/guest',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/guest', redirect: '/Guest/login' },
      { path: '/guest/login', component: './Guest/Login' },
      { path: '/guest/register', component: './Guest/Register' },
      { path: '/guest/register-result', component: './Guest/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/guest/login' },
    ],
  },
];

