import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export function useScrollReveal(threshold = 0.12): {
	el: Ref<Element | null>;
	revealed: Ref<boolean>;
} {
	const el = ref<Element | null>(null);
	const revealed = ref(false);
	let observer: IntersectionObserver | null = null;

	onMounted(() => {
		if (!el.value || typeof IntersectionObserver === 'undefined') {
			revealed.value = true;
			return;
		}
		observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					revealed.value = true;
					observer?.disconnect();
				}
			},
			{ threshold },
		);
		observer.observe(el.value);
	});

	onBeforeUnmount(() => observer?.disconnect());

	return { el, revealed };
}
