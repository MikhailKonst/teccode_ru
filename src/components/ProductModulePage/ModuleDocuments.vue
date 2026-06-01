<template>
	<section class="docs" v-if="docs.length">
		<span class="docs__bar" aria-hidden="true"></span>
		<div class="docs__container">
			<RouterLink
				v-for="(doc, i) in docs"
				:key="doc.id"
				class="docs__item"
				:to="{ name: ROUTES.moduleDoc.name, params: { slug: moduleSlug, docId: doc.id } }"
				:style="{ animationDelay: `${0.05 * i}s` }"
			>
				<span class="docs__file" aria-hidden="true">
					<span class="docs__file-tab">TXT</span>
					<span class="docs__file-code">
						<i class="docs__code-line docs__code-line--kw"></i>
						<i class="docs__code-line docs__code-line--lg"></i>
						<i class="docs__code-line docs__code-line--md"></i>
						<i class="docs__code-line docs__code-line--lg"></i>
						<i class="docs__code-line docs__code-line--sm"></i>
					</span>
				</span>
				<span class="docs__title">{{ doc.title }}</span>
			</RouterLink>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ROUTES } from '@/router/routes';
import type { ModuleDocumentLink } from '@/api/software';

defineProps<{
	moduleSlug: string;
	docs: ModuleDocumentLink[];
}>();
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

.docs {
	margin-top: 3.5rem;

	// Фирменная красная полоса над документами
	&__bar {
		display: block;
		width: 100%;
		max-width: 960px;
		height: 3px;
		margin: 0 auto 1.5rem;
		border-radius: 3px;
		background: linear-gradient(
			to right,
			rgba($main-red-color, 0) 0%,
			rgba($main-red-color, 0.85) 50%,
			rgba($main-red-color, 0) 100%
		);
		box-shadow: 0 0 12px rgba($main-red-color, 0.35);
	}

	&__container {
		max-width: 960px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2.2rem 4rem;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 1.6rem 2rem;
		}
	}

	&__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		// Кликабельна только зона самого документа, а не вся ячейка грида.
		justify-self: center;
		width: fit-content;
		gap: 1rem;
		color: rgba($main-text-color, 0.9);
		text-decoration: none;
		cursor: pointer;
		opacity: 0;
		animation: fadeInUp 0.6s ease forwards;
		transition: transform 0.15s ease-out;

		&:hover {
			transform: translateY(-4px);

			.docs__title {
				color: $main-red-color;
			}

			.docs__file {
				border-color: $main-red-color;
				box-shadow: 0 16px 36px rgba(0, 0, 0, 0.95);
				background: radial-gradient(
					circle at 30% 15%,
					rgba($main-red-color, 0.18),
					rgba(0, 0, 0, 0.75)
				);
			}
		}
	}

	// Сам «файл программиста»: лист с загнутым углом и строками кода внутри.
	&__file {
		position: relative;
		width: 84px;
		height: 104px;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.4);
		border: 2px solid rgba(255, 255, 255, 0.9);
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.8);
		overflow: hidden;
		transition:
			border-color 0.15s ease-out,
			box-shadow 0.15s ease-out,
			background 0.15s ease-out;

		// Загнутый угол
		&::before {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			width: 22px;
			height: 22px;
			border-top: 2px solid rgba(255, 255, 255, 0.9);
			border-left: 2px solid rgba(255, 255, 255, 0.9);
			transform: translate(10px, -10px) rotate(45deg);
			background: rgba(0, 0, 0, 0.98);
		}
	}

	// Ярлык типа файла в верхнем левом углу
	&__file-tab {
		position: absolute;
		top: 8px;
		left: 8px;
		padding: 1px 5px;
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: $main-red-color;
		border: 1px solid rgba($main-red-color, 0.6);
		border-radius: 3px;
		background: rgba($main-red-color, 0.08);
	}

	// Имитация строк кода внутри листа
	&__file-code {
		position: absolute;
		left: 11px;
		right: 11px;
		bottom: 12px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__code-line {
		display: block;
		height: 4px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.28);

		&--kw {
			width: 45%;
			background: rgba($main-red-color, 0.75);
		}

		&--lg { width: 90%; }
		&--md { width: 70%; }
		&--sm { width: 55%; }
	}

	&__title {
		max-width: 14ch;
		font-size: 0.95rem;
		line-height: 1.5;
		text-align: center;
		color: rgba($main-text-color, 0.92);
		transition: color 0.15s ease-out;
	}
}
</style>
