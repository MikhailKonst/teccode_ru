<template>
	<main class="landing">
		<section id="home" class="landing__section">
			<HeroSection />
		</section>

		<section id="directions" class="landing__section">
			<ServicesSection />
		</section>

		<section id="solutions" class="landing__section">
			<Software />
		</section>

		<section id="contact-form" class="landing__section">
			<ContactForm />
		</section>

		<section id="contacts" class="landing__section">
			<Contacts />
		</section>
	</main>
</template>

<script setup lang="ts">
import HeroSection from '@/components/HomePage/HeroSection.vue';
import ServicesSection from '@/components/DirectionPage/ServicesSection.vue';
import Software from '@/components/SoftwareSolutionsPage/Software.vue';
import ContactForm from '@/pages/ContactFormPage.vue';
import Contacts from '@/components/ContactsPage/Contacts.vue';

defineOptions({ name: 'LandingPage' });
</script>

<style scoped lang="scss">
.landing {
	display: flex;
	flex-direction: column;

	&__section {
		scroll-margin-top: 90px;
		// Каждая секция — ровно один экран: следующая не выглядывает снизу.
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	// Главная: контент в верхней части экрана, с небольшим отступом от хедера.
	#home {
		justify-content: flex-start;
		padding-top: 8rem;
	}

	// Программные решения: контент от верха, а не по центру экрана.
	#solutions {
		justify-content: flex-start;
	}
}
</style>
