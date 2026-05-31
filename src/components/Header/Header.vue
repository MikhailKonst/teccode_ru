<template>
	<header class="header">
		<div class="header__container">
			<div class="header__brand">
				<RouterLink :to="ROUTES.home.path" class="header__logo">
					<b>tech</b>
					<hr />
					code
				</RouterLink>
			</div>

			<nav class="header__nav">
				<RouterLink
					v-for="link in NAV_LINKS"
					:key="link.id"
					:to="{ path: '/', hash: `#${link.id}` }"
					class="header__cta-link"
					:class="{ 'header__cta-link--active': activeId === link.id }"
				>
					{{ link.label }}
				</RouterLink>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ROUTES } from '@/router/routes';
import { useScrollSpy } from '@/composables/useScrollSpy';

defineOptions({ name: 'AppHeader' });

const NAV_LINKS = [
	{ id: 'directions', label: 'Направления' },
	{ id: 'solutions', label: 'Программные решения' },
	{ id: 'contact-form', label: 'Написать нам' },
	{ id: 'contacts', label: 'Контакты' },
] as const;

const { activeId } = useScrollSpy(['home', 'directions', 'solutions', 'contact-form', 'contacts']);
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

.header {
	position: sticky;
	top: 0;
	z-index: 100;
	padding: 1rem 2rem;
	color: $main-text-color;
	background: rgba(16, 18, 26, 0.72);
	backdrop-filter: blur(12px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	box-shadow: 0 1px 0 rgba($main-red-color, 0.18), 0 8px 24px rgba(0, 0, 0, 0.35);

	@media (max-width: 1240px) {
		padding: 0.75rem 1.5rem;
	}

	@media (max-width: 930px) {
		padding: 0.75rem 1.25rem;
	}

	@media (max-width: 500px) {
		padding: 0.5rem 1rem;
	}

	&__container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		@media (max-width: 930px) {
			justify-content: center;
			row-gap: 0.5rem;
		}

		@media (max-width: 500px) {
			flex-direction: column;
			align-items: center;
			row-gap: 0.4rem;
		}
	}

	&__brand {
		display: flex;
		align-items: center;
		gap: 1.25rem;

		@media (max-width: 930px) {
			width: 100%;
			justify-content: space-between;
		}

		@media (max-width: 500px) {
			flex-direction: column;
			align-items: center;
			gap: 0.3rem;
		}
	}

	&__logo {
		font-size: 1.9rem;
		font-weight: 100;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		flex-shrink: 0;

		b {
			color: $main-red-color;
			font-weight: 700;
		}

		@media (max-width: 1240px) {
			font-size: 1.7rem;
		}

		@media (max-width: 500px) {
			font-size: 1.5rem;
		}
	}

	&__nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;

		@media (max-width: 1240px) {
			gap: 1.25rem;
		}

		@media (max-width: 930px) {
			width: 100%;
			justify-content: center;
		}

		@media (max-width: 500px) {
			gap: 0.75rem;
		}
	}

	&__cta-link {
		position: relative;
		font-size: 0.9rem;
		font-weight: 100;
		padding: 0.5rem 1rem;
		color: $main-text-color;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		transition: color 0.3s;
		white-space: nowrap;

		@media (max-width: 1240px) {
			font-size: 0.85rem;
			padding: 0.4rem 0.8rem;
		}

		@media (max-width: 500px) {
			font-size: 0.8rem;
		}

		// Подчёркивающая полоска-индикатор активной вкладки
		&::after {
			content: '';
			position: absolute;
			left: 1rem;
			right: 1rem;
			bottom: 0.15rem;
			height: 2px;
			border-radius: 2px;
			background: $main-red-color;
			box-shadow: 0 0 8px rgba($main-red-color, 0.6);
			transform: scaleX(0);
			transform-origin: center;
			transition: transform 0.3s ease;

			@media (max-width: 1240px) {
				left: 0.8rem;
				right: 0.8rem;
			}
		}

		&:hover {
			color: $main-red-color;

			&::after {
				transform: scaleX(0.55);
				opacity: 0.5;
			}
		}

		&--active {
			color: $main-red-color;

			&::after {
				transform: scaleX(1);
				opacity: 1;
			}
		}
	}
}
</style>
