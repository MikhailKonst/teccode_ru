<template>
	<div id="app">
		<StarfieldBackground v-if="!isAdmin" />
		<Header v-if="!isAdmin" />
		<Transition name="page" mode="out-in">
			<router-view :key="route.path" />
		</Transition>
		<Transition name="scroll-top">
			<button
				v-if="!isAdmin && isHome && scrolledPastHero"
				type="button"
				class="scroll-top"
				aria-label="Наверх"
				@click="scrollToTop"
			>
				<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
					<path
						d="M12 5l-7 7m7-7l7 7m-7-7v14"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</Transition>
		<CursorShadow v-if="!isAdmin" />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header/Header.vue';
import CursorShadow from './components/CursorShadow/CursorShadow.vue';
import StarfieldBackground from './components/StarfieldBackground.vue';
import { ROUTES } from '@/router/routes';

const route = useRoute();
const isAdmin = computed(() => String(route.path ?? '').startsWith('/admin'));
const isHome = computed(() => route.path === ROUTES.home.path);

// Кнопка «наверх» появляется на главной, когда пользователь прокрутил
// ниже стартового экрана (hero-текста).
const scrolledPastHero = ref(false);

function onScroll() {
	scrolledPastHero.value = window.scrollY > window.innerHeight * 0.6;
}

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
});

onUnmounted(() => {
	window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped lang="scss">
@use './assets/styles/variables.scss' as *;

#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.scroll-top {
	position: fixed;
	right: 1.5rem;
	bottom: 1.5rem;
	z-index: 200;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 3rem;
	height: 3rem;
	padding: 0;
	cursor: pointer;
	border-radius: 50%;
	color: rgba(255, 60, 60, 0.9);
	background: rgba(16, 18, 26, 0.72);
	backdrop-filter: blur(12px);
	// Красная обводка со свечением — как полоса-разделитель на главной.
	border: 2px solid rgba(255, 60, 60, 0.55);
	box-shadow: 0 0 12px rgba(255, 60, 60, 0.25);
	transition: color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

	&:hover {
		color: rgba(255, 60, 60, 1);
		transform: translateY(-3px);
		border-color: rgba(255, 60, 60, 0.85);
		box-shadow: 0 0 18px rgba(255, 60, 60, 0.45);
	}

	@media (max-width: 500px) {
		right: 1rem;
		bottom: 1rem;
		width: 2.6rem;
		height: 2.6rem;
	}
}

.scroll-top-enter-active,
.scroll-top-leave-active {
	transition: opacity 0.25s ease, transform 0.25s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
	opacity: 0;
	transform: translateY(12px);
}

.page-enter-active,
.page-leave-active {
	transition: opacity 0.22s ease, transform 0.22s ease;
}

.page-enter-from {
	opacity: 0;
	transform: translateY(8px);
}

.page-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}
</style>
