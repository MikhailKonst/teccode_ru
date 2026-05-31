<template>
	<div class="term">
		<div class="term__bar">
			<span class="term__dot term__dot--red" />
			<span class="term__dot term__dot--yellow" />
			<span class="term__dot term__dot--green" />
			<span class="term__file">about.txt</span>
		</div>

		<div class="term__body">
			<div
				v-for="(line, li) in LINES"
				:key="li"
				class="term__line"
				:class="{ 'term__line--empty': line.length === 0 }"
			>
				<template v-for="(tok, ti) in line" :key="ti">
					<span :class="['term__tok', tok.cls ? `term__tok--${tok.cls}` : '']">{{
						visibleText(li, ti, tok.text)
					}}</span>
				</template>
				<span
					v-if="li === state.line"
					class="term__cursor"
					:class="{ 'term__cursor--on': cursorOn }"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';

interface Token {
	text: string;
	cls?: string;
}

const LINES: Token[][] = [
	[{ text: '$ cat about.txt', cls: 'cmd' }],
	[],
	[
		{ text: 'Технокод', cls: 'brand' },
		{ text: ' — инновационная ИТ-компания,' },
	],
	[
		{ text: 'специализирующаяся на ' },
		{ text: 'внедрении решений', cls: 'kw' },
	],
	[
		{ text: 'в области ' },
		{ text: 'искусственного интеллекта,', cls: 'str' },
	],
	[{ text: 'заказной разработке программного' }],
	[
		{ text: 'обеспечения и ' },
		{ text: 'аутсорсинге', cls: 'kw' },
		{ text: ' разработчиков.' },
	],
	[],
	[
		{ text: 'Мы предлагаем ' },
		{ text: 'полный цикл услуг', cls: 'hl' },
		{ text: ' —' },
	],
	[
		{ text: 'от ' },
		{ text: 'аналитики и проектирования', cls: 'kw' },
		{ text: ' до' },
	],
	[
		{ text: 'сопровождения и ' },
		{ text: 'масштабирования', cls: 'str' },
	],
	[{ text: 'ИТ-продуктов.', cls: 'muted' }],
];

const CHAR_MS = 22;
const LINE_PAUSE_MS = 75;
const START_DELAY_MS = 350;

const state = reactive({ line: 0, token: 0, char: 0 });
const cursorOn = ref(true);

let typeTimer: ReturnType<typeof setTimeout> | null = null;
let blinkTimer: ReturnType<typeof setInterval> | null = null;

function visibleText(li: number, ti: number, full: string): string {
	if (li < state.line) return full;
	if (li > state.line) return '';
	if (ti < state.token) return full;
	if (ti > state.token) return '';
	return full.slice(0, state.char);
}

function step() {
	const line = LINES[state.line];

	if (!line || line.length === 0) {
		// пустая строка — сразу переходим к следующей
		state.line++;
		state.token = 0;
		state.char = 0;
		if (state.line < LINES.length) typeTimer = setTimeout(step, CHAR_MS);
		return;
	}

	const tok = line[state.token];
	if (!tok) return;

	if (state.char < tok.text.length) {
		state.char++;
		typeTimer = setTimeout(step, CHAR_MS);
	} else if (state.token < line.length - 1) {
		state.token++;
		state.char = 0;
		typeTimer = setTimeout(step, CHAR_MS);
	} else {
		state.line++;
		state.token = 0;
		state.char = 0;
		if (state.line < LINES.length) typeTimer = setTimeout(step, LINE_PAUSE_MS);
	}
}

onMounted(() => {
	typeTimer = setTimeout(step, START_DELAY_MS);
	blinkTimer = setInterval(() => {
		cursorOn.value = !cursorOn.value;
	}, 520);
});

onBeforeUnmount(() => {
	if (typeTimer) clearTimeout(typeTimer);
	if (blinkTimer) clearInterval(blinkTimer);
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.term {
	width: 100%;
	max-width: 100%;
	border-radius: 14px;
	border: 1px solid rgba(255, 255, 255, 0.12);
	background: rgba(10, 11, 18, 0.78);
	backdrop-filter: blur(16px);
	box-shadow:
		0 32px 72px rgba(0, 0, 0, 0.65),
		0 0 0 1px rgba(255, 255, 255, 0.05) inset;
	overflow: hidden;

	&__bar {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 0.7rem 1rem;
		background: rgba(255, 255, 255, 0.04);
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		flex-shrink: 0;
	}

	&__dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		flex-shrink: 0;
		&--red    { background: #ff5f57; }
		&--yellow { background: #febc2e; }
		&--green  { background: #28c841; }
	}

	&__file {
		margin: 0 auto;
		font-size: 11px;
		color: rgba(255, 255, 255, 0.3);
		font-family: 'Segoe UI', sans-serif;
		letter-spacing: 0.03em;
	}

	&__body {
		padding: 1.25rem 1.5rem 1.6rem;
		height: 380px;
		display: flex;
		flex-direction: column;
		gap: 0;
		overflow: hidden;

		@media (max-width: 930px) {
			height: 330px;
			padding: 1rem 1.2rem 1.3rem;
		}

		@media (max-width: 500px) {
			height: 270px;
			padding: 0.8rem 0.9rem 1rem;
		}
	}

	&__line {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		min-height: 1.6em;
		font-family: 'Consolas', 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
		font-size: 0.92rem;
		line-height: 1.6;

		@media (max-width: 930px) {
			font-size: 0.86rem;
		}

		@media (max-width: 500px) {
			font-size: 0.78rem;
		}

		&--empty {
			min-height: 0.65em;
		}
	}

	&__tok {
		color: rgba(255, 255, 255, 0.8);
		white-space: pre-wrap;

		&--cmd   { color: rgba(255, 255, 255, 0.38); }
		&--brand { color: #ff6b6b; font-weight: 700; letter-spacing: 0.02em; }
		&--kw    { color: #82aaff; }
		&--str   { color: #c3e88d; }
		&--hl    { color: #ffcb6b; font-weight: 600; }
		&--muted { color: rgba(255, 255, 255, 0.45); }
	}

	&__cursor {
		display: inline-block;
		width: 7px;
		height: 1em;
		border-radius: 1px;
		background: rgba(255, 255, 255, 0.75);
		margin-left: 1px;
		flex-shrink: 0;
		opacity: 0;
		transition: opacity 0.05s;
		&--on { opacity: 1; }
	}
}
</style>
