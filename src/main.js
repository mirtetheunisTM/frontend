import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import OrderList from './components/OrderList.vue'
import OrderDetail from './components/OrderDetail.vue'
import Login from './components/Login.vue'
import ChangePassword from './components/ChangePassword.vue'
import ProfilePage from './components/ProfilePage.vue'

const routes = [
    { path: '/login', component: Login},
    { path: '/', component: OrderList },
    { path: '/order/:id', component: OrderDetail, name: 'OrderDetail' },
    { path: '/change-password', component: ChangePassword },
    { path: '/profile', component: ProfilePage},
    { path: '/test', component: OrderDetail },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    console.log('Navigating to:', to.fullPath);
    next();
  });

const app = createApp(App)
app.use(router)
app.mount('#app')
