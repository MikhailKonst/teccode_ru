import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Scroll-spy по позиции прокрутки: выбирает секцию, чей верх уже прошёл линию
 * `offset` от верха окна. Надёжно работает с секциями разной высоты и корректно
 * подсвечивает последнюю секцию при прокрутке до самого низа.
 * На страницах без этих секций activeId остаётся пустым.
 */
export function useScrollSpy(
	sectionIds: string[],
	offset = 130,
): { activeId: Ref<string> } {
	const activeId = ref('');
	const route = useRoute();
	let raf = 0;

	function update() {
		const els = sectionIds
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null);

		if (!els.length) {
			activeId.value = '';
			return;
		}

		// Доскроллили до низа документа → активна последняя секция.
		const scrollBottom = window.scrollY + window.innerHeight;
		if (scrollBottom >= document.documentElement.scrollHeight - 4) {
			activeId.value = els[els.length - 1].id;
			return;
		}

		const line = window.scrollY + offset;
		let current = els[0].id;
		for (const el of els) {
			if (el.offsetTop <= line) current = el.id;
			else break;
		}
		activeId.value = current;
	}

	function onScroll() {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(update);
	}

	onMounted(() => {
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		requestAnimationFrame(update);
	});

	watch(
		() => route.path,
		() => requestAnimationFrame(update),
	);

	onBeforeUnmount(() => {
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onScroll);
		cancelAnimationFrame(raf);
	});

	return { activeId };
}
