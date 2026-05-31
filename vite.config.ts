import { defineConfig, loadEnv, type PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ mode, command }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const backendPort = Number(env.PORT ?? process.env.PORT ?? 3001);
	const raw = String(env.VITE_API_BASE_URL ?? `http://localhost:${backendPort}`).trim();
	const base = raw.replace(/\/+$/, '');
	const target = base.endsWith('/api') ? base.slice(0, -4) : base;

	// vue-devtools подключаем только в dev-режиме (в прод-сборку не попадает).
	const plugins: PluginOption[] = [vue()];
	if (command === 'serve') plugins.push(vueDevTools());

	return {
		plugins,
		resolve: {
			alias: {
				'@': '/src',
			},
		},
		server: {
			host: '127.0.0.1',
			port: 5173,
			strictPort: false,
			proxy: {
				'/api': {
					target,
					changeOrigin: true,
				},
				'/uploads': {
					target,
					changeOrigin: true,
				},
			},
		},
	};
});
