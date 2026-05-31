<template>
	<section class="admin">
		<div class="admin__container">
			<header class="admin__header">
				<div class="admin__header-left">
					<RouterLink :to="{ name: ROUTES.admin.name }" class="admin__brand">
						TECH <span class="admin__brand-sep">|</span> CODE
					</RouterLink>
					<h1 class="admin__title">ADMIN</h1>
				</div>
				<div class="admin__header-actions">
					<a :href="publicSiteHref" target="_blank" rel="noopener" class="admin__link">
						← На сайт
					</a>
					<button class="admin__logout" type="button" @click="onLogout">Выйти</button>
				</div>
			</header>

			<nav class="admin__nav">
				<RouterLink :to="{ name: ROUTES.admin.name }" class="admin__nav-item">
					Модули
				</RouterLink>
				<RouterLink :to="{ name: ROUTES.adminContacts.name }" class="admin__nav-item admin__nav-item--active">
					Журнал заявок
					<span v-if="unreadCount > 0" class="admin__nav-badge">{{ unreadCount }}</span>
				</RouterLink>
			</nav>

			<section class="admin__card ui-panel">
				<div class="admin__toolbar">
					<h2 class="admin__card-title">Входящие заявки</h2>
					<button class="admin__btn" type="button" :disabled="loading" @click="load">
						{{ loading ? 'Загрузка…' : 'Обновить' }}
					</button>
				</div>

				<!-- Фильтры -->
				<div class="admin__filters">
					<button
						v-for="f in FILTERS"
						:key="f.value"
						class="admin__filter-btn"
						:class="{ 'admin__filter-btn--active': filter === f.value }"
						type="button"
						@click="setFilter(f.value)"
					>
						{{ f.label }}
						<span v-if="f.value === 'unread' && unreadCount > 0" class="admin__filter-count">
							{{ unreadCount }}
						</span>
					</button>

					<button
						v-if="filter !== 'all' && items.length"
						class="admin__btn admin__btn--danger admin__btn--sm"
						type="button"
						@click="onDeleteByFilter"
					>
						Удалить {{ filter === 'read' ? 'все прочитанные' : 'все непрочитанные' }}
					</button>
				</div>

				<p v-if="loading && !items.length" class="admin__muted">Загрузка…</p>
				<p v-else-if="!items.length" class="admin__muted">
					{{ filter === 'unread' ? 'Непрочитанных заявок нет' : filter === 'read' ? 'Прочитанных заявок нет' : 'Заявок пока нет' }}
				</p>

				<ul v-else class="admin__list">
					<li
						v-for="item in items"
						:key="item.id"
						class="admin__item"
						:class="{ 'admin__item--open': openIds.has(item.id) }"
					>
						<div class="admin__item-row" @click="toggleOpen(item.id)">
							<div class="admin__item-meta">
								<span
									class="admin__item-unread"
									:title="item.isRead ? 'Прочитано' : 'Не прочитано'"
								>{{ item.isRead ? '' : '●' }}</span>
								<span class="admin__item-date">{{ formatDate(item.createdAt) }}</span>
								<span
									class="admin__item-badge"
									:class="item.emailSent ? 'admin__item-badge--sent' : 'admin__item-badge--pending'"
									:title="item.emailSent ? 'Заявка получена на корпоративную почту' : 'Почта не настроена — на email не доставлено'"
								>
									{{ item.emailSent ? '✓ получено на почту' : '— только в журнале' }}
								</span>
							</div>
							<div class="admin__item-who">
								<strong class="admin__item-name">{{ item.name }}</strong>
								<a
									class="admin__item-email"
									:href="`mailto:${item.email}`"
									@click.stop
								>{{ item.email }}</a>
							</div>
							<p class="admin__item-preview">{{ truncate(item.message, 120) }}</p>
							<div class="admin__item-controls">
								<span class="admin__item-toggle">
									{{ openIds.has(item.id) ? '▲ Свернуть' : '▼ Читать' }}
								</span>
								<button
									class="admin__btn admin__btn--danger"
									type="button"
									@click.stop="onDelete(item.id)"
								>
									Удалить
								</button>
							</div>
						</div>

						<Transition name="expand">
							<div v-if="openIds.has(item.id)" class="admin__item-body">
								<p class="admin__item-message">{{ item.message }}</p>
								<div class="admin__item-actions">
									<a
										class="admin__btn"
										:href="`mailto:${item.email}?subject=Re: TechCode`"
									>
										Ответить
									</a>
								</div>
							</div>
						</Transition>
					</li>
				</ul>

				<div v-if="pages > 1" class="admin__pagination">
					<button
						class="admin__btn"
						:disabled="page <= 1 || loading"
						@click="goPage(page - 1)"
					>
						← Назад
					</button>
					<span class="admin__page-info">{{ page }} / {{ pages }}</span>
					<button
						class="admin__btn"
						:disabled="page >= pages || loading"
						@click="goPage(page + 1)"
					>
						Вперёд →
					</button>
				</div>
			</section>
		</div>
	</section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ROUTES } from '@/router/routes';
import { useAdminStore } from '@/admin/stores/admin';
import { adminApi, type ContactSubmission } from '@/admin/api/admin';

type ContactFilter = 'all' | 'read' | 'unread';

const router = useRouter();
const store = useAdminStore();
const publicSiteHref = router.resolve(ROUTES.softwareSolutions.path).href;

const FILTERS: Array<{ value: ContactFilter; label: string }> = [
	{ value: 'all', label: 'Все' },
	{ value: 'unread', label: 'Непрочитанные' },
	{ value: 'read', label: 'Прочитанные' },
];

const loading = ref(false);
const items = ref<ContactSubmission[]>([]);
const unreadCount = ref(0);
const page = ref(1);
const pages = ref(1);
const filter = ref<ContactFilter>('all');
const openIds = ref(new Set<string>());

function formatDate(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

function truncate(text: string, maxLen: number): string {
	if (text.length <= maxLen) return text;
	return text.slice(0, maxLen).trimEnd() + '…';
}

async function toggleOpen(id: string) {
	if (openIds.value.has(id)) {
		openIds.value.delete(id);
		return;
	}
	openIds.value.add(id);

	const item = items.value.find((i) => i.id === id);
	if (item && !item.isRead) {
		try {
			await adminApi.markContactRead(id, store.token);
			item.isRead = true;
			unreadCount.value = Math.max(0, unreadCount.value - 1);
		} catch {
			/* непрочитанный статус останется — не критично */
		}
	}
}

async function load() {
	loading.value = true;
	try {
		const res = await adminApi.getContacts(store.token, page.value, filter.value);
		items.value = res.items;
		unreadCount.value = res.unreadCount;
		pages.value = res.pages;
	} finally {
		loading.value = false;
	}
}

async function setFilter(value: ContactFilter) {
	if (filter.value === value) return;
	filter.value = value;
	page.value = 1;
	openIds.value.clear();
	await load();
}

async function goPage(p: number) {
	page.value = p;
	openIds.value.clear();
	await load();
}

async function onDelete(id: string) {
	if (!confirm('Удалить заявку?')) return;
	await adminApi.deleteContact(id, store.token);
	openIds.value.delete(id);
	await load();
}

async function onDeleteByFilter() {
	const label = filter.value === 'read' ? 'все прочитанные' : 'все непрочитанные';
	if (!confirm(`Удалить ${label} заявки? Это действие необратимо.`)) return;
	await adminApi.deleteContactsByFilter(filter.value as 'read' | 'unread', store.token);
	openIds.value.clear();
	await load();
}

async function onLogout() {
	await store.logout();
	router.replace({ name: ROUTES.adminLogin.name });
}

onMounted(load);
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.admin {
	padding: 5rem 1rem;
	min-height: 100vh;
	color: #111827;
	background: transparent;

	:deep(.ui-panel) {
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: #ffffff;
		box-shadow: 0 18px 45px rgba(17, 24, 39, 0.08);
	}

	&__container {
		max-width: 1200px;
		margin: 0 auto;
	}

	&__header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	&__header-left {
		display: grid;
		gap: 0.35rem;
	}

	&__brand {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		font-weight: 900;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #111827;
		border-bottom: 1px solid transparent;
		width: fit-content;
		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.6);
		}
	}

	&__brand-sep {
		opacity: 0.6;
	}

	&__title {
		font-size: 1.8rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__header-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	&__link {
		color: rgba(17, 24, 39, 0.9);
		border-bottom: 1px solid transparent;
		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.6);
		}
	}

	&__logout {
		background: transparent;
		border: 1px solid rgba(17, 24, 39, 0.18);
		border-radius: 10px;
		padding: 0.55rem 0.9rem;
		color: #111827;
		cursor: pointer;
		&:hover {
			border-color: rgba($main-red-color, 0.6);
			color: $main-red-color;
		}
	}

	&__nav {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid rgba(17, 24, 39, 0.1);
	}

	&__nav-item {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: rgba(17, 24, 39, 0.55);
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		transition: color 0.2s ease, border-color 0.2s ease;

		&:hover {
			color: #111827;
		}

		&--active {
			color: $main-red-color;
			border-bottom-color: $main-red-color;
		}
	}

	&__nav-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 5px;
		border-radius: 10px;
		background: $main-red-color;
		color: #ffffff;
		font-size: 0.7rem;
		font-weight: 700;
	}

	&__card {
		padding: 1.5rem;
	}

	&__toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	&__card-title {
		font-size: 1.1rem;
		font-weight: 700;
		margin: 0;
	}

	&__filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid rgba(17, 24, 39, 0.08);
	}

	&__filter-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		border: 1px solid rgba(17, 24, 39, 0.14);
		background: transparent;
		color: rgba(17, 24, 39, 0.7);
		font-size: 0.85rem;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;

		&:hover {
			border-color: rgba($main-red-color, 0.5);
			color: #111827;
		}

		&--active {
			background: $main-red-color;
			border-color: $main-red-color;
			color: #ffffff;

			&:hover {
				color: #ffffff;
			}
		}
	}

	&__filter-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		border-radius: 9px;
		background: rgba(17, 24, 39, 0.12);
		font-size: 0.7rem;
		font-weight: 700;
	}

	&__filter-btn--active &__filter-count {
		background: rgba(255, 255, 255, 0.25);
	}

	&__muted {
		color: rgba(17, 24, 39, 0.65);
	}

	&__list {
		display: grid;
		gap: 0.6rem;
	}

	&__item {
		border-radius: 12px;
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: #ffffff;
		box-shadow: 0 4px 12px rgba(17, 24, 39, 0.04);
		overflow: hidden;
		transition: box-shadow 0.2s ease;

		&:hover {
			box-shadow: 0 8px 20px rgba(17, 24, 39, 0.08);
		}

		&--open {
			border-color: rgba($main-red-color, 0.2);
		}
	}

	&__item-row {
		padding: 0.9rem 1rem;
		cursor: pointer;
		display: grid;
		gap: 0.35rem;
	}

	&__item-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	&__item-unread {
		color: $main-red-color;
		font-size: 0.7rem;
		line-height: 1;
		width: 0.7rem;
		display: inline-flex;
		justify-content: center;
	}

	&__item-date {
		font-size: 0.8rem;
		color: rgba(17, 24, 39, 0.5);
		font-variant-numeric: tabular-nums;
	}

	&__item-badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.15rem 0.5rem;
		border-radius: 6px;

		&--sent {
			background: rgba(16, 185, 129, 0.1);
			color: #059669;
		}

		&--pending {
			background: rgba(17, 24, 39, 0.06);
			color: rgba(17, 24, 39, 0.45);
		}
	}

	&__item-who {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	&__item-name {
		font-size: 0.95rem;
		font-weight: 700;
	}

	&__item-email {
		font-size: 0.85rem;
		color: $main-red-color;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	&__item-preview {
		font-size: 0.88rem;
		color: rgba(17, 24, 39, 0.6);
		margin: 0;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	&__item-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.25rem;
	}

	&__item-toggle {
		font-size: 0.8rem;
		color: rgba(17, 24, 39, 0.45);
	}

	&__item-body {
		padding: 0.9rem 1rem 1rem;
		border-top: 1px solid rgba(17, 24, 39, 0.08);
		background: rgba(17, 24, 39, 0.015);
	}

	&__item-message {
		font-size: 0.92rem;
		line-height: 1.7;
		color: #111827;
		white-space: pre-wrap;
		word-break: break-word;
		margin: 0 0 0.75rem;
	}

	&__item-actions {
		display: flex;
		gap: 0.6rem;
	}

	&__btn {
		background: transparent;
		border: 1px solid rgba(17, 24, 39, 0.18);
		border-radius: 10px;
		padding: 0.5rem 0.75rem;
		color: #111827;
		cursor: pointer;
		font-size: 0.9rem;
		text-decoration: none;
		display: inline-flex;
		align-items: center;

		&:hover:not(:disabled) {
			border-color: rgba($main-red-color, 0.6);
			color: $main-red-color;
			background: rgba($main-red-color, 0.06);
		}

		&--danger:hover:not(:disabled) {
			border-color: rgba($main-red-color, 0.6);
			background: rgba($main-red-color, 0.12);
			color: $main-red-color;
		}

		&--sm {
			padding: 0.4rem 0.7rem;
			font-size: 0.8rem;
			margin-left: auto;
		}

		&:disabled {
			opacity: 0.45;
			cursor: default;
		}
	}

	&__pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	&__page-info {
		font-size: 0.9rem;
		color: rgba(17, 24, 39, 0.6);
	}
}

.expand-enter-active,
.expand-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
	opacity: 0;
	transform: translateY(-6px);
}
</style>
