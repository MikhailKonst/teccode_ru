import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { ROUTES } from './routes';
import { isAdminAuthed } from '@/admin/auth';

const routes: RouteRecordRaw[] = [
	{
		path: ROUTES.home.path,
		name: ROUTES.home.name,
		component: () => import('@/pages/LandingPage.vue'),
	},
	// Старые отдельные маршруты секций → якоря на лендинге (одностраничный режим).
	// Сохранены, чтобы существующие ссылки (хлебные крошки, кнопки на страницах
	// продуктов, ссылка из админки) продолжали вести в нужную секцию.
	{ path: ROUTES.directions.path, redirect: { path: '/', hash: '#directions' } },
	{ path: ROUTES.softwareSolutions.path, redirect: { path: '/', hash: '#solutions' } },
	{ path: ROUTES.contacts.path, redirect: { path: '/', hash: '#contacts' } },
	{ path: ROUTES.contactForm.path, redirect: { path: '/', hash: '#contact-form' } },
	{
		path: ROUTES.module.path,
		name: ROUTES.module.name,
		component: () => import('@/pages/ProductModulePage.vue'),
	},
	{
		path: ROUTES.moduleDoc.path,
		name: ROUTES.moduleDoc.name,
		component: () => import('@/pages/ModuleDocumentPage.vue'),
	},
	{
		path: ROUTES.adminLogin.path,
		name: ROUTES.adminLogin.name,
		component: () => import('@/admin/pages/AdminLoginPage.vue'),
		meta: { guestOnly: true },
	},
	{
		path: ROUTES.admin.path,
		name: ROUTES.admin.name,
		component: () => import('@/admin/pages/AdminPanelPage.vue'),
		meta: { requiresAdmin: true },
	},
	{
		path: ROUTES.adminModule.path,
		name: ROUTES.adminModule.name,
		component: () => import('@/admin/pages/AdminModuleEditPage.vue'),
		meta: { requiresAdmin: true },
	},
	{
		path: ROUTES.adminContacts.path,
		name: ROUTES.adminContacts.name,
		component: () => import('@/admin/pages/AdminContactsPage.vue'),
		meta: { requiresAdmin: true },
	},
	{ path: '/sofware-solutions', redirect: ROUTES.softwareSolutions.path },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, _from, savedPosition) {
		if (to.hash) {
			return { el: to.hash, top: 80, behavior: 'smooth' };
		}
		if (savedPosition) return savedPosition;
		return { top: 0 };
	},
});

router.afterEach((to) => {
	try {
		if (typeof document === 'undefined') return;
		const isAdmin = String(to.path ?? '').startsWith('/admin');
		document.body.classList.toggle('admin-mode', isAdmin);
	} catch {
		return;
	}
});

router.beforeEach((to) => {
	const needsAdmin = to.matched.some((r) => Boolean(r.meta.requiresAdmin));
	const guestOnly = to.matched.some((r) => Boolean(r.meta.guestOnly));
	const authed = isAdminAuthed();

	if (needsAdmin && !authed) {
		return { name: ROUTES.adminLogin.name, query: { redirect: to.fullPath } };
	}
	if (guestOnly && authed) {
		return { name: ROUTES.admin.name };
	}
	return true;
});

export default router;
