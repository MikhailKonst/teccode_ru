<template>
	<span class="typing">
		{{ shown }}<span class="typing__caret" :class="{ 'typing__caret--done': done }">|</span>
	</span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

defineOptions({ name: 'TypingText' });

const props = withDefaults(
	defineProps<{
		text: string;
		// мс на символ
		speed?: number;
		// задержка перед началом печати, мс
		startDelay?: number;
	}>(),
	{ speed: 60, startDelay: 200 },
);

const shown = ref('');
const done = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function run() {
	clearTimeout(timer);
	shown.value = '';
	done.value = false;

	const full = props.text ?? '';

	// Уважаем системную настройку «уменьшить движение» — показываем сразу.
	const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
	if (reduce || !full) {
		shown.value = full;
		done.value = true;
		return;
	}

	let i = 0;
	const tick = () => {
		shown.value = full.slice(0, i + 1);
		i += 1;
		if (i >= full.length) {
			done.value = true;
			return;
		}
		timer = setTimeout(tick, props.speed);
	};
	timer = setTimeout(tick, props.startDelay);
}

// Печатаем при первом показе и заново при смене текста (переход между модулями).
watch(() => props.text, run, { immediate: true });

onBeforeUnmount(() => clearTimeout(timer));
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.typing {
	// Курсор не должен «прыгать» на новую строку отдельно от текста.
	white-space: pre-wrap;

	&__caret {
		display: inline-block;
		margin-left: 0.06em;
		color: $main-red-color;
		font-weight: 400;
		animation: typing-blink 1s steps(1) infinite;
	}

	// После окончания печати курсор продолжает мягко мигать.
	&__caret--done {
		animation: typing-blink 1.1s steps(1) infinite;
	}
}

@keyframes typing-blink {
	50% {
		opacity: 0;
	}
}
</style>
