<template>
	<section class="contacts">
		<h2 class="contacts__title">Контакты</h2>

		<div class="contacts__container">
			<div class="contacts__info">
				<p class="contacts__org">Общество с ограниченной ответственностью «ТЕХНОКОД»</p>

				<ul class="contacts__list">
					<li v-for="item in CONTACTS" :key="item.label" class="contacts__item">
						<span class="contacts__label">{{ item.label }}</span>
						<component
							:is="item.href ? 'a' : 'span'"
							:href="item.href || undefined"
							:class="item.href ? 'contacts__link' : 'contacts__value'"
						>
							{{ item.value }}
						</component>
					</li>
				</ul>
			</div>

			<div class="contacts__divider"></div>

			<div class="contacts__map">
				<iframe
					class="contacts__map-frame"
					src="https://yandex.ru/map-widget/v1/?text=%D0%A1%D0%B0%D0%BC%D0%B0%D1%80%D0%B0%2C%20%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B5%20%D1%88%D0%BE%D1%81%D1%81%D0%B5%2C%204%20%D1%81%D1%82%D1%80%209&lang=ru_RU"
					frameborder="0"
					allowfullscreen
				></iframe>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
defineOptions({ name: 'ContactsPageContacts' });

const CONTACTS = [
	{
		label: 'ИНН:',
		value: '6316286124',
		href: null,
	},
	{
		label: 'Телефон:',
		value: '+7 961 381 9822',
		href: 'tel:+79613819822',
	},
	{
		label: 'Адрес:',
		value: 'г. Самара, Московское шоссе, 4 стр. 9, офис 703',
		href: null,
	},
	{
		label: 'Режим работы:',
		value: 'Пн–Пт: 09:00 – 18:00',
		href: null,
	},
	{
		label: 'Для заказов:',
		value: 'info@teccode.ru',
		href: 'mailto:info@teccode.ru',
	},
	{
		label: 'Служба поддержки:',
		value: 'support@teccode.ru',
		href: 'mailto:support@teccode.ru',
	},
] as const;
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

.contacts {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 2px minmax(0, 1fr);
		gap: 3.5rem;
		align-items: stretch;

		@media (max-width: 960px) {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
	}

	&__divider {
		width: 2px;
		border-radius: 2px;
		align-self: stretch;
		background: linear-gradient(
			to bottom,
			rgba(255, 60, 60, 0) 0%,
			rgba(255, 60, 60, 0.45) 22%,
			rgba(255, 60, 60, 0.55) 50%,
			rgba(255, 60, 60, 0.45) 78%,
			rgba(255, 60, 60, 0) 100%
		);
		box-shadow: 0 0 12px rgba(255, 60, 60, 0.25);

		@media (max-width: 960px) {
			width: 80%;
			height: 2px;
			justify-self: center;
			background: linear-gradient(
				to right,
				rgba(255, 60, 60, 0) 0%,
				rgba(255, 60, 60, 0.5) 50%,
				rgba(255, 60, 60, 0) 100%
			);
		}
	}

	&__info {
		padding: 3.25rem 2.75rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.7);
		opacity: 0;
		animation: fadeInLeft 0.8s ease forwards;
	}

	&__title {
		font-size: 2.1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		text-align: center;
		margin: 0 auto 2.75rem;
	}

	&__org {
		font-size: 0.98rem;
		color: rgba($main-text-color, 0.95);
		margin-bottom: 1.5rem;
	}

	&__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
	}

	&__item {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;

		@media (min-width: 600px) {
			flex-direction: row;
			gap: 0.5rem;
		}
	}

	&__label {
		font-size: 0.9rem;
		color: rgba($main-text-color, 0.7);
		min-width: 130px;
	}

	&__value {
		font-size: 0.95rem;
		color: rgba($main-text-color, 0.95);
	}

	&__link {
		font-size: 0.95rem;
		color: $main-text-color;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.7);
		}
	}

	&__map {
		min-height: 440px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.7);
		overflow: hidden;
		opacity: 0;
		animation: fadeInRight 0.8s ease forwards;
		animation-delay: 0.1s;
	}

	&__map-frame {
		width: 100%;
		height: 100%;
		border: 0;
	}
}
</style>
