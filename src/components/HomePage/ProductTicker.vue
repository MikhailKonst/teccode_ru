<template>
	<div class="ticker">
		<div class="ticker__head">
			<span class="ticker__dot" />
			<span class="ticker__label">products.log</span>
		</div>

		<div class="ticker__screen">
			<Transition name="ticker-swap" mode="out-in">
				<div :key="index" class="ticker__item">
					<span class="ticker__icon" aria-hidden="true">{{ current.icon }}</span>
					<div class="ticker__text">
						<span class="ticker__kicker">Программный модуль</span>
						<span class="ticker__name">
							<TypingText :text="`«${current.title}»`" :speed="45" />
						</span>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import TypingText from '@/components/TypingText.vue';

interface Product {
	icon: string;
	title: string;
}

const products: Product[] = [
	{ icon: '🔥', title: 'Детектор огня' },
	{ icon: '📒', title: 'Справочник документов сотрудника' },
	{ icon: '📹', title: 'Передача видеопотока по протоколу RTSP' },
	{ icon: '⏯️', title: 'Транскодирование видеопотока' },
	{ icon: '📘', title: 'Справочник документов по электробезопасности' },
	{ icon: '🎞️', title: 'Формирование композитного видеоканала' },
	{ icon: '🔔', title: 'Звуковые уведомления' },
	{ icon: '📚', title: 'Справочник курсов переподготовки' },
	{ icon: '🛡️', title: 'Системные сервисы и службы' },
	{ icon: '📄', title: 'Формирование документов' },
	{ icon: '📊', title: 'Формирование отчётов' },
	{ icon: '✒️', title: 'Формирование периодических задач' },
	{ icon: '🗂️', title: 'Формирование шаблонов документов' },
	{ icon: '👥', title: 'Потоковое распознавание лиц' },
	{ icon: '🎯', title: 'Классификатор целей по видеоизображению' },
];

const SWAP_MS = 4000;

const index = ref(0);
const current = computed(() => products[index.value]);

let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
	timer = setInterval(() => {
		index.value = (index.value + 1) % products.length;
	}, SWAP_MS);
});

onBeforeUnmount(() => {
	if (timer) clearInterval(timer);
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.ticker {
	margin-top: 1.75rem;
	width: 100%;
	max-width: 460px;
	border-radius: 12px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(10, 11, 18, 0.55);
	backdrop-filter: blur(10px);
	overflow: hidden;

	&__head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.85rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	&__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: $main-red-color;
		box-shadow: 0 0 8px rgba($main-red-color, 0.7);
		flex-shrink: 0;
	}

	&__label {
		font-family: 'Consolas', 'JetBrains Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: rgba(255, 255, 255, 0.4);
	}

	&__screen {
		padding: 1.1rem 1.1rem;
		// Фиксированная высота — окно не «прыгает» при разной длине названия.
		height: 104px;
		display: flex;
		align-items: center;
	}

	&__item {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		width: 100%;
	}

	&__icon {
		font-size: 1.9rem;
		line-height: 1;
		flex-shrink: 0;
		filter: drop-shadow(0 0 10px rgba($main-red-color, 0.25));
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	&__kicker {
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.4);
	}

	&__name {
		font-size: 0.98rem;
		font-weight: 600;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.92);
		// Резерв под две строки: текст растёт вниз, первая строка не смещается
		// при печати и при переходе между короткими и длинными названиями.
		min-height: 2.7em;
	}

	@media (max-width: 930px) {
		max-width: 100%;
	}
}

.ticker-swap-enter-active,
.ticker-swap-leave-active {
	transition: opacity 0.35s ease, transform 0.35s ease;
}

.ticker-swap-enter-from {
	opacity: 0;
	transform: translateY(8px);
}

.ticker-swap-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}
</style>
