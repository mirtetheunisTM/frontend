import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import OrderList from './components/OrderList.vue'
import OrderDetail from './components/OrderDetail.vue'
import Login from './components/Login.vue'
import ChangePassword from './components/ChangePassword.vue'
import ProfilePage from './components/ProfilePage.vue'
import SneakerConfigurator from './components/SneakerConfigurator.vue'
import Order from './components/Order.vue'

const routes = [
    {
        path: '/',
        redirect: '/shop',
    },    
    { path: '/login', component: Login},
    { path: '/dashboard', component: OrderList },
    { path: '/order/:id', component: OrderDetail, name: 'OrderDetail' },
    { path: '/change-password', component: ChangePassword },
    { path: '/profile', component: ProfilePage},
    { path: '/shop', component: SneakerConfigurator},
    { path: '/order', name: 'Order', component: Order}
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
