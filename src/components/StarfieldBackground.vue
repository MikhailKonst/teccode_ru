<template>
	<!-- eslint-disable-next-line vue/no-v-html -->
	<div ref="root" class="starfield" aria-hidden="true" v-html="svg" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
// SMIL-анимации (электроны, мерцание, вспышки) работают только когда SVG
// встроен в DOM, а не подключён через CSS background-image. Поэтому импортируем
// исходник как строку и рендерим инлайн.
import svg from '@/assets/images/code-bg.svg?raw';

defineOptions({ name: 'StarfieldBackground' });

const root = ref<HTMLElement | null>(null);

// Слои рисунка с разной «глубиной»: дальний план (боке, микрозвёзды) смещается
// слабо, ближний (сеть созвездий) — сильно. Разная скорость = ощущение объёма.
let layers: { el: SVGElement; depth: number }[] = [];

// Амплитуда смещения в единицах viewBox (1440×900). Небольшая — фон спокойный,
// а объём созвездий создаётся разницей глубины слоёв, а не размахом движения.
const AMP = 44;
let nx = 0;
let ny = 0;
let raf = 0;

function apply() {
	raf = 0;
	for (const { el, depth } of layers) {
		const x = -nx * AMP * depth;
		const y = -ny * AMP * depth;
		el.style.transform = `translate(${x}px, ${y}px)`;
	}
}

function onMove(e: PointerEvent) {
	nx = (e.clientX / window.innerWidth - 0.5) * 2;
	ny = (e.clientY / window.innerHeight - 0.5) * 2;
	// Один пересчёт на кадр — плавность обеспечивает CSS-transition на слоях.
	if (!raf) raf = requestAnimationFrame(apply);
}

onMounted(() => {
	const el = root.value;
	if (!el) return;
	layers = Array.from(el.querySelectorAll<SVGElement>('[data-depth]')).map((node) => ({
		el: node,
		depth: Number(node.dataset.depth) || 0,
	}));
	window.addEventListener('pointermove', onMove, { passive: true });
});

onBeforeUnmount(() => {
	window.removeEventListener('pointermove', onMove);
	cancelAnimationFrame(raf);
});
</script>

<style scoped lang="scss">
.starfield {
	position: fixed;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	overflow: hidden;

	:deep(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}

	// Плавное, инерционное доведение слоёв до целевого положения.
	:deep([data-depth]) {
		transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
		will-change: transform;
	}
}
</style>
