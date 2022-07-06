import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',

    routes: [
        {
            name: '404',
            path: '*',
            component: () => import('@/pages/errors/404.vue'),
            meta: {
                title: 'Not found'
            }
        },
        {
            name: 'home',
            path: '/',
            component: () => import('@/pages/Home.vue')
        },
        {
            name: 'user',
            path: '/user',
            component: () => import('@/pages/User.vue')
        },
        {
            name: 'import',
            path: '/import',
            component: () => import('@/pages/Import.vue')
        },
    ]
});
