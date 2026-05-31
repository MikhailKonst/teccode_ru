<template>
	<section ref="heroEl" class="hero" @pointermove="onMove" @pointerleave="onLeave">
		<div class="hero__container">
			<div class="hero__column hero__column--left" :style="leftTilt">
				<h2 class="hero__title">ИИ в системах безопасности</h2>
				<p class="hero__subtitle">
					Глубоко понимаем специфику внедрения искусственного интеллекта в системы
					безопасности объекта
				</p>
				<ProductTicker />
			</div>

			<div class="hero__divider"></div>

			<div class="hero__column hero__column--right" :style="rightTilt">
				<TerminalTyping />
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TerminalTyping from './TerminalTyping.vue';
import ProductTicker from './ProductTicker.vue';

const heroEl = ref<HTMLElement | null>(null);
// нормализованное смещение курсора от центра: -1..1
const mx = ref(0);
const my = ref(0);

function onMove(e: PointerEvent) {
	const el = heroEl.value;
	if (!el) return;
	const r = el.getBoundingClientRect();
	mx.value = ((e.clientX - r.left) / r.width - 0.5) * 2;
	my.value = ((e.clientY - r.top) / r.height - 0.5) * 2;
}

function onLeave() {
	mx.value = 0;
	my.value = 0;
}

// Колонки наклоняются в 3D в разные стороны — эффект глубины/параллакса
const rightTilt = computed(() => ({
	transform: `perspective(1100px) rotateY(${-mx.value * 6}deg) rotateX(${my.value * 6}deg) translateZ(30px)`,
}));
const leftTilt = computed(() => ({
	transform: `perspective(1100px) rotateY(${-mx.value * 2.5}deg) rotateX(${my.value * 2.5}deg)`,
}));
</script>

<style scoped lang="scss">
.hero {
	// Высоту задаёт секция-обёртка; контент прижат к верху, к хедеру.
	padding: 0.5rem 1rem 2rem;
	position: relative;
	width: 100%;
	color: #e0e0e0;

	@media (max-width: 500px) {
		padding: 0.5rem 1rem 1.5rem;
	}

	&__container {
		display: grid;
		grid-template-columns: 1fr 1px 1fr;
		gap: 5rem;
		max-width: 1200px;
		margin: 0 auto;
		align-items: center;

		@media (max-width: 1240px) {
			max-width: 1000px;
			gap: 2.5rem;
		}

		@media (max-width: 930px) {
			grid-template-columns: 1fr;
			justify-items: center;
			gap: 2rem;
		}

		@media (max-width: 500px) {
			gap: 1.5rem;
		}
	}

	&__column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		transform-style: preserve-3d;
		transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
		will-change: transform;
		animation-duration: 1s;
		animation-fill-mode: both;

		@media (max-width: 1240px) {
			max-width: 820px;
			width: 100%;
		}

		@media (max-width: 930px) {
			max-width: 720px;
			align-items: center;
		}

		@media (max-width: 500px) {
			align-items: flex-start;
		}

		&--left {
			animation-name: fadeInLeft;
		}

		&--right {
			animation-name: fadeInRight;
		}
	}

	&__divider {
		width: 2px;
		height: 140%;
		justify-self: center;
		border-radius: 2px;
		background: linear-gradient(
			to bottom,
			rgba(255, 60, 60, 0) 0%,
			rgba(255, 60, 60, 0.45) 22%,
			rgba(255, 60, 60, 0.55) 50%,
			rgba(255, 60, 60, 0.45) 78%,
			rgba(255, 60, 60, 0) 100%
		);
		box-shadow: 0 0 12px rgba(255, 60, 60, 0.25);

		@media (max-width: 930px) {
			width: 80%;
			height: 2px;
			margin: 2rem auto;
			background: linear-gradient(
				to right,
				rgba(255, 60, 60, 0) 0%,
				rgba(255, 60, 60, 0.5) 50%,
				rgba(255, 60, 60, 0) 100%
			);
		}

		@media (max-width: 500px) {
			width: 90%;
			margin: 1.25rem auto;
		}
	}

	&__title {
		font-size: 3rem;
		font-weight: 700;
		text-transform: uppercase;
		margin-bottom: 1.5rem;

		text-align: left;
		letter-spacing: 0.08em;
		word-spacing: normal;

		text-shadow: 0 0 10px rgba(255, 60, 60, 0.3);

		@media (max-width: 1240px) {
			font-size: 2.6rem;
			letter-spacing: 0.06em;
		}

		@media (max-width: 930px) {
			font-size: 2.2rem;
			letter-spacing: 0.05em;
			text-align: center;
		}

		@media (max-width: 500px) {
			font-size: 1.8rem;
			letter-spacing: 0.04em;
			margin-bottom: 1.1rem;
			text-align: left;
		}
	}

}
</style>
