<template>
	<section class="doc-page" v-if="moduleItem && doc">
		<div class="doc-page__container">
			<p class="doc-page__breadcrumb">
				<RouterLink :to="ROUTES.softwareSolutions.path" class="doc-page__crumb-link">
					Программные решения
				</RouterLink>
				<span class="doc-page__crumb-sep">/</span>
				<RouterLink
					:to="{ name: ROUTES.module.name, params: { slug } }"
					class="doc-page__crumb-link"
				>
					{{ moduleItem.title }}
				</RouterLink>
				<span class="doc-page__crumb-sep">/</span>
				<span>{{ doc.title }}</span>
			</p>

			<h1 class="doc-page__title">{{ doc.title }}</h1>

			<div class="doc-page__content ui-panel">
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div v-if="isHtmlContent" class="doc-page__rich" v-html="sanitizedContent" />
				<div v-else class="doc-page__blocks">
					<template v-for="(b, idx) in blocks" :key="idx">
						<p v-if="b.type === 'p'" class="doc-page__p">{{ b.text }}</p>
						<div v-else-if="b.type === 'img'" class="doc-page__img-wrap">
							<img class="doc-page__img" :src="b.src" :alt="b.alt" loading="lazy" />
						</div>
						<div v-else class="doc-page__space" />
					</template>
				</div>
			</div>

			<RouterLink :to="{ name: ROUTES.module.name, params: { slug } }" class="doc-page__back">
				← Назад к модулю
			</RouterLink>
		</div>
	</section>

	<section class="doc-page" v-else>
		<div class="doc-page__container">
			<h1 class="doc-page__title">Документ не найден</h1>
			<RouterLink :to="ROUTES.softwareSolutions.path" class="doc-page__back"
				>← К списку модулей</RouterLink
			>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import DOMPurify from 'dompurify';
import { ROUTES } from '@/router/routes';
import { softwareApi, type DocumentItem, type ModuleDetail } from '@/api/software';

const route = useRoute();

const slug = computed(() => String(route.params.slug ?? ''));
const docId = computed(() => String(route.params.docId ?? ''));

const moduleItem = ref<ModuleDetail | null>(null);
const doc = ref<DocumentItem | null>(null);

function resolveUploadSrc(src: string) {
	const raw = String(import.meta.env.VITE_API_BASE_URL ?? '')
		.trim()
		.replace(/\/$/, '');
	const base = raw ? (raw.endsWith('/api') ? raw.slice(0, -4) : raw) : '';

	const localAbs = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/uploads\/.+)$/i.exec(src);
	if (localAbs?.[1]) src = localAbs[1];

	if (src.startsWith('/uploads/')) return base ? `${base}${src}` : src;
	return src;
}

function parseBlocks(raw: string) {
	const text = String(raw ?? '').replace(/\r\n/g, '\n');
	const lines = text.split('\n');
	const blocks: Array<
		{ type: 'p'; text: string } | { type: 'img'; src: string; alt: string } | { type: 'space' }
	> = [];

	function pushText(t: string) {
		const s = String(t ?? '');
		if (!s.trim()) return;
		blocks.push({ type: 'p', text: s });
	}

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) {
			blocks.push({ type: 'space' });
			continue;
		}

		const exact = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);
		if (exact) {
			const alt = String(exact[1] ?? '').trim();
			const src = String(exact[2] ?? '').trim();
			const ok =
				src.startsWith('/uploads/') ||
				src.startsWith('http://') ||
				src.startsWith('https://');
			if (ok) {
				blocks.push({ type: 'img', src: resolveUploadSrc(src), alt });
				continue;
			}
		}

		const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
		let last = 0;
		let matched = false;
		for (const m of line.matchAll(re)) {
			matched = true;
			const idx = m.index ?? 0;
			if (idx > last) pushText(line.slice(last, idx));

			const alt = String(m[1] ?? '').trim();
			const src = String(m[2] ?? '').trim();
			const ok =
				src.startsWith('/uploads/') ||
				src.startsWith('http://') ||
				src.startsWith('https://');
			if (ok) {
				blocks.push({ type: 'img', src: resolveUploadSrc(src), alt });
			} else {
				pushText(String(m[0] ?? ''));
			}

			last = idx + String(m[0] ?? '').length;
		}

		if (matched) {
			if (last < line.length) pushText(line.slice(last));
			continue;
		}

		pushText(line);
	}

	return blocks;
}

const rawContent = computed(() => String(doc.value?.content ?? ''));
const isHtmlContent = computed(() => rawContent.value.trimStart().startsWith('<'));
const sanitizedContent = computed(() =>
	DOMPurify.sanitize(rawContent.value, { USE_PROFILES: { html: true } }),
);
const blocks = computed(() => parseBlocks(rawContent.value));

async function load() {
	moduleItem.value = null;
	doc.value = null;
	try {
		const [{ module }, { document }] = await Promise.all([
			softwareApi.getModule(slug.value),
			softwareApi.getDocument(docId.value),
		]);
		moduleItem.value = module;
		doc.value = document;
	} catch {
		moduleItem.value = null;
		doc.value = null;
	}
}

onMounted(load);
watch([slug, docId], load);
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.doc-page {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 960px;
		margin: 0 auto;
	}

	&__breadcrumb {
		font-size: 0.85rem;
		color: rgba($main-text-color, 0.6);
		margin-bottom: 0.75rem;
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}

	&__crumb-link {
		color: rgba($main-text-color, 0.85);
		border-bottom: 1px solid transparent;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.7);
		}
	}

	&__crumb-sep {
		opacity: 0.6;
	}

	&__title {
		font-size: 2rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.75rem;
	}

	&__content {
		padding: 2.5rem;
		border-radius: 14px;
		margin-bottom: 1.5rem;
		background: #f8f9fb !important;
		border: 1px solid rgba(0, 0, 0, 0.06) !important;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18) !important;

		/* Перебиваем глобальный * { color: white } из main.scss */
		:deep(*) {
			color: #1a1d2e;
		}
		:deep(a) {
			color: $main-red-color;
		}
	}

	$doc-text: #1a1d2e;

	&__rich {
		font-size: 0.97rem;
		line-height: 1.75;
		color: $doc-text;

		:deep(p) { margin: 0 0 0.75em; &:last-child { margin-bottom: 0; } }
		:deep(h2) {
			font-size: 1.2rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.06em;
			margin: 1.4em 0 0.5em;
			color: $doc-text;
		}
		:deep(h3) { font-size: 1rem; font-weight: 700; margin: 1.1em 0 0.4em; color: $doc-text; }
		:deep(ul), :deep(ol) {
			padding-left: 1.5em;
			margin: 0.4em 0;
			li { margin-bottom: 0.25em; color: $doc-text; }
		}
		:deep(a) { color: $main-red-color; text-decoration: underline; text-underline-offset: 2px; }
		:deep(strong) { font-weight: 700; color: $doc-text; }
		:deep(em) { font-style: italic; }
		:deep([style*="text-align"]) { display: block; }
		:deep(img) {
			max-width: 100%;
			height: auto;
			display: block;
			border-radius: 10px;
			border: 1px solid rgba(0, 0, 0, 0.08);
			margin: 1.2em 0;
		}
	}

	&__blocks {
		display: grid;
		gap: 1rem;
	}

	&__p {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
		font-family: inherit;
		font-size: 0.97rem;
		line-height: 1.75;
		color: #1a1d2e;
	}

	&__img-wrap {
		width: 100%;
		display: grid;
		place-items: start;
	}

	&__img {
		max-width: 100%;
		height: auto;
		display: block;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.08);
	}

	&__space {
		height: 0.5rem;
	}

	&__back {
		display: inline-flex;
		font-size: 0.9rem;
		color: $main-text-color;
		border-bottom: 1px solid transparent;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.7);
		}
	}
}
</style>
