<template>
	<section class="module" v-if="moduleItem">
		<div class="module__container">
			<p class="module__breadcrumb">
				<RouterLink :to="ROUTES.softwareSolutions.path" class="module__crumb-link">
					Программные решения
				</RouterLink>
				<span class="module__crumb-sep">/</span>
				<span>{{ moduleItem.title }}</span>
			</p>

			<h1 class="module__title">
				<TypingText :key="moduleItem.slug" :text="moduleItem.title" />
			</h1>

			<!-- eslint-disable-next-line vue/no-v-html -->
			<div class="module__subtitle" v-html="sanitizedDescription" />

			<RouterLink :to="ROUTES.contactForm.path" class="module__cta ui-cta"
				>Запросить цену</RouterLink
			>

			<ModuleDocuments :module-slug="moduleItem.slug" :docs="moduleItem.documents" />
		</div>
	</section>

	<section v-else class="module module--not-found">
		<div class="module__container">
			<h1 class="module__title">Модуль не найден</h1>
			<RouterLink :to="ROUTES.softwareSolutions.path" class="module__cta ui-cta"
				>К списку модулей</RouterLink
			>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import DOMPurify from 'dompurify';
import { ROUTES } from '@/router/routes';
import ModuleDocuments from '@/components/ProductModulePage/ModuleDocuments.vue';
import TypingText from '@/components/TypingText.vue';
import { softwareApi, type ModuleDetail } from '@/api/software';

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ''));

const moduleItem = ref<ModuleDetail | null>(null);

const sanitizedDescription = computed(() => {
	const raw = moduleItem.value?.description ?? '';
	return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
});

async function load() {
	moduleItem.value = null;
	try {
		const { module } = await softwareApi.getModule(slug.value);
		moduleItem.value = module;
	} catch {
		moduleItem.value = null;
	}
}

onMounted(load);
watch(slug, load);
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.module {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 900px;
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
		font-size: 2.1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 1.25rem;
	}

	&__subtitle {
		font-size: 0.98rem;
		color: rgba($main-text-color, 0.9);
		line-height: 1.7;
		margin-bottom: 2rem;

		:deep(p) {
			margin: 0 0 0.6em;
			&:last-child { margin-bottom: 0; }
		}

		:deep(h2) {
			font-size: 1.15rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.06em;
			margin: 1em 0 0.4em;
		}

		:deep(h3) {
			font-size: 1rem;
			font-weight: 700;
			margin: 0.9em 0 0.35em;
		}

		:deep(ul),
		:deep(ol) {
			padding-left: 1.4em;
			margin: 0.4em 0;
			li { margin-bottom: 0.2em; }
		}

		:deep(a) {
			color: $main-red-color;
			text-decoration: underline;
			text-underline-offset: 2px;
		}

		:deep(strong) { font-weight: 700; }
		:deep(em) { font-style: italic; }
		:deep([style*="text-align"]) { display: block; }
	}

	&__cta {
		margin-bottom: 1.5rem;
	}
}
</style>
