<template>
	<div id="app">
		<StarfieldBackground v-if="!isAdmin" />
		<Header v-if="!isAdmin" />
		<Transition name="page" mode="out-in">
			<router-view :key="route.path" />
		</Transition>
		<CursorShadow v-if="!isAdmin" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header/Header.vue';
import CursorShadow from './components/CursorShadow/CursorShadow.vue';
import StarfieldBackground from './components/StarfieldBackground.vue';

const route = useRoute();
const isAdmin = computed(() => String(route.path ?? '').startsWith('/admin'));
</script>

<style scoped lang="scss">
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.page-enter-active,
.page-leave-active {
	transition: opacity 0.22s ease, transform 0.22s ease;
}

.page-enter-from {
	opacity: 0;
	transform: translateY(8px);
}

.page-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}
</style>
