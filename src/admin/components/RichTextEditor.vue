<template>
	<div class="rte" :class="{ 'rte--disabled': disabled }">
		<div class="rte__toolbar" role="toolbar" aria-label="Форматирование">
			<button
				type="button"
				class="rte__tool rte__tool--bold"
				:class="{ 'rte__tool--active': editor?.isActive('bold') }"
				:disabled="disabled"
				title="Жирный (Ctrl+B)"
				@click="editor?.chain().focus().toggleBold().run()"
			>
				B
			</button>
			<button
				type="button"
				class="rte__tool rte__tool--italic"
				:class="{ 'rte__tool--active': editor?.isActive('italic') }"
				:disabled="disabled"
				title="Курсив (Ctrl+I)"
				@click="editor?.chain().focus().toggleItalic().run()"
			>
				I
			</button>
			<span class="rte__sep" />
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive('heading', { level: 2 }) }"
				:disabled="disabled"
				title="Заголовок 2"
				@click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
			>
				H2
			</button>
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive('heading', { level: 3 }) }"
				:disabled="disabled"
				title="Заголовок 3"
				@click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
			>
				H3
			</button>
			<span class="rte__sep" />
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive('bulletList') }"
				:disabled="disabled"
				title="Маркированный список"
				@click="editor?.chain().focus().toggleBulletList().run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<circle cx="2" cy="4" r="1.5" fill="currentColor"/>
					<rect x="5" y="3" width="9" height="2" rx="1" fill="currentColor"/>
					<circle cx="2" cy="8" r="1.5" fill="currentColor"/>
					<rect x="5" y="7" width="9" height="2" rx="1" fill="currentColor"/>
					<circle cx="2" cy="12" r="1.5" fill="currentColor"/>
					<rect x="5" y="11" width="9" height="2" rx="1" fill="currentColor"/>
				</svg>
			</button>
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive('orderedList') }"
				:disabled="disabled"
				title="Нумерованный список"
				@click="editor?.chain().focus().toggleOrderedList().run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<text x="0" y="5" font-size="5" fill="currentColor">1.</text>
					<rect x="5" y="3" width="9" height="2" rx="1" fill="currentColor"/>
					<text x="0" y="9" font-size="5" fill="currentColor">2.</text>
					<rect x="5" y="7" width="9" height="2" rx="1" fill="currentColor"/>
					<text x="0" y="13" font-size="5" fill="currentColor">3.</text>
					<rect x="5" y="11" width="9" height="2" rx="1" fill="currentColor"/>
				</svg>
			</button>
			<span class="rte__sep" />
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive('link') }"
				:disabled="disabled"
				title="Ссылка"
				@click="onLinkClick"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M6.5 9.5a3.5 3.5 0 0 0 4.95 0l1.77-1.77a3.5 3.5 0 0 0-4.95-4.95l-1 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
					<path d="M9.5 6.5a3.5 3.5 0 0 0-4.95 0L2.78 8.27a3.5 3.5 0 0 0 4.95 4.95l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</button>
			<button
				v-if="editor?.isActive('link')"
				type="button"
				class="rte__tool rte__tool--unlink"
				:disabled="disabled"
				title="Удалить ссылку"
				@click="editor?.chain().focus().extendMarkRange('link').unsetLink().run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M6.5 9.5a3.5 3.5 0 0 0 4.95 0l1.77-1.77a3.5 3.5 0 0 0-4.95-4.95l-1 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 2"/>
					<path d="M9.5 6.5a3.5 3.5 0 0 0-4.95 0L2.78 8.27a3.5 3.5 0 0 0 4.95 4.95l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 2"/>
					<line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</button>
			<span class="rte__sep" />
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive({ textAlign: 'left' }) }"
				:disabled="disabled"
				title="По левому краю"
				@click="editor?.chain().focus().setTextAlign('left').run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="1" y="7" width="9" height="2" rx="1" fill="currentColor"/>
					<rect x="1" y="11" width="12" height="2" rx="1" fill="currentColor"/>
				</svg>
			</button>
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive({ textAlign: 'center' }) }"
				:disabled="disabled"
				title="По центру"
				@click="editor?.chain().focus().setTextAlign('center').run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="3.5" y="7" width="9" height="2" rx="1" fill="currentColor"/>
					<rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor"/>
				</svg>
			</button>
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive({ textAlign: 'right' }) }"
				:disabled="disabled"
				title="По правому краю"
				@click="editor?.chain().focus().setTextAlign('right').run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="6" y="7" width="9" height="2" rx="1" fill="currentColor"/>
					<rect x="3" y="11" width="12" height="2" rx="1" fill="currentColor"/>
				</svg>
			</button>
			<button
				type="button"
				class="rte__tool"
				:class="{ 'rte__tool--active': editor?.isActive({ textAlign: 'justify' }) }"
				:disabled="disabled"
				title="По ширине"
				@click="editor?.chain().focus().setTextAlign('justify').run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/>
					<rect x="1" y="11" width="14" height="2" rx="1" fill="currentColor"/>
				</svg>
			</button>
			<span class="rte__sep" />
			<button
				type="button"
				class="rte__tool"
				:disabled="disabled || !editor?.can().undo()"
				title="Отменить (Ctrl+Z)"
				@click="editor?.chain().focus().undo().run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 6H9.5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M3 6L6 3M3 6l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<button
				type="button"
				class="rte__tool"
				:disabled="disabled || !editor?.can().redo()"
				title="Повторить (Ctrl+Y)"
				@click="editor?.chain().focus().redo().run()"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M13 6H6.5a3.5 3.5 0 0 0 0 7H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M13 6l-3-3M13 6l-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>

		<EditorContent class="rte__body" :editor="editor" />

		<Transition name="rte-fade">
			<div v-if="linkDialogOpen" class="rte__link-dialog" @keydown.esc="closeLinkDialog">
				<input
					ref="linkInput"
					class="rte__link-input"
					type="url"
					v-model="linkUrl"
					placeholder="https://example.com"
					@keydown.enter.prevent="applyLink"
					@keydown.esc="closeLinkDialog"
				/>
				<button type="button" class="rte__link-apply" @click="applyLink">Применить</button>
				<button type="button" class="rte__link-cancel" @click="closeLinkDialog">✕</button>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

const props = withDefaults(
	defineProps<{
		modelValue: string;
		placeholder?: string;
		disabled?: boolean;
	}>(),
	{
		placeholder: 'Введите описание…',
		disabled: false,
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

const linkDialogOpen = ref(false);
const linkUrl = ref('');
const linkInput = ref<HTMLInputElement | null>(null);

const editor = useEditor({
	content: props.modelValue || '',
	editable: !props.disabled,
	extensions: [
		StarterKit.configure({
			heading: { levels: [2, 3] },
		}),
		Link.configure({
			openOnClick: false,
			HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
		}),
		Image.configure({
			HTMLAttributes: { class: 'rte-img' },
		}),
		TextAlign.configure({
			types: ['heading', 'paragraph'],
		}),
		Placeholder.configure({ placeholder: props.placeholder }),
	],
	onUpdate({ editor: e }) {
		const html = e.getHTML();
		emit('update:modelValue', html === '<p></p>' ? '' : html);
	},
});

watch(
	() => props.disabled,
	(val) => editor.value?.setEditable(!val),
);

watch(
	() => props.modelValue,
	(val) => {
		if (!editor.value) return;
		if (editor.value.getHTML() === val) return;
		editor.value.commands.setContent(val || '', { emitUpdate: false });
	},
);

function onLinkClick() {
	if (!editor.value) return;
	const prev = editor.value.getAttributes('link').href as string | undefined;
	linkUrl.value = prev ?? 'https://';
	linkDialogOpen.value = true;
	nextTick(() => {
		linkInput.value?.focus();
		linkInput.value?.select();
	});
}

function applyLink() {
	if (!editor.value) return;
	const url = linkUrl.value.trim();
	if (!url || url === 'https://') {
		editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
	} else {
		editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}
	closeLinkDialog();
}

function closeLinkDialog() {
	linkDialogOpen.value = false;
	linkUrl.value = '';
	editor.value?.commands.focus();
}

function insertImage(url: string) {
	editor.value?.chain().focus().setImage({ src: url }).run();
}

defineExpose({ insertImage });

onBeforeUnmount(() => editor.value?.destroy());
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.rte {
	display: grid;
	grid-template-rows: auto 1fr auto;
	border-radius: 10px;
	border: 1px solid rgba(17, 24, 39, 0.18);
	background: #ffffff;
	transition: border-color 0.2s ease, box-shadow 0.2s ease;

	&:focus-within {
		border-color: rgba($main-red-color, 0.8);
		box-shadow: 0 0 0 4px rgba($main-red-color, 0.12);
	}

	&--disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	&__toolbar {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 0.4rem 0.5rem;
		border-bottom: 1px solid rgba(17, 24, 39, 0.1);
		flex-wrap: wrap;
	}

	&__tool {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 6px;
		border: none;
		background: transparent;
		color: rgba(17, 24, 39, 0.65);
		cursor: pointer;
		font-size: 0.8rem;
		font-family: inherit;
		transition: background 0.15s ease, color 0.15s ease;

		&:hover:not(:disabled) {
			background: rgba(17, 24, 39, 0.07);
			color: #111827;
		}

		&--active {
			background: rgba($main-red-color, 0.1);
			color: $main-red-color;

			&:hover:not(:disabled) {
				background: rgba($main-red-color, 0.16);
				color: $main-red-color;
			}
		}

		&:disabled {
			opacity: 0.35;
			cursor: default;
		}

		&--bold {
			font-weight: 800;
		}

		&--italic {
			font-style: italic;
			font-weight: 600;
		}

		&--unlink {
			color: rgba($main-red-color, 0.7);
		}
	}

	&__sep {
		width: 1px;
		height: 18px;
		background: rgba(17, 24, 39, 0.12);
		margin: 0 0.2rem;
		flex-shrink: 0;
	}

	&__body {
		min-height: 140px;
		padding: 0.75rem 0.9rem;
		cursor: text;

		:deep(.ProseMirror) {
			min-height: 120px;
			outline: none;
			font-size: 0.9rem;
			line-height: 1.65;
			color: #111827;
			word-break: break-word;

			p {
				margin: 0 0 0.5em;

				&:last-child {
					margin-bottom: 0;
				}
			}

			[style*="text-align: center"],
			[style*="text-align:center"] { text-align: center; }
			[style*="text-align: right"],
			[style*="text-align:right"]  { text-align: right; }
			[style*="text-align: justify"],
			[style*="text-align:justify"] { text-align: justify; }

			h2 {
				font-size: 1.1rem;
				font-weight: 700;
				margin: 0.75em 0 0.35em;
				text-transform: uppercase;
				letter-spacing: 0.05em;
			}

			h3 {
				font-size: 0.95rem;
				font-weight: 700;
				margin: 0.65em 0 0.3em;
			}

			ul,
			ol {
				padding-left: 1.4em;
				margin: 0.4em 0;

				li {
					margin-bottom: 0.2em;
				}
			}

			a {
				color: $main-red-color;
				text-decoration: underline;
				text-underline-offset: 2px;
			}

			strong {
				font-weight: 700;
			}

			em {
				font-style: italic;
			}

			img,
			.rte-img {
				max-width: 100%;
				height: auto;
				display: block;
				border-radius: 8px;
				border: 1px solid rgba(17, 24, 39, 0.1);
				cursor: default;

				&.ProseMirror-selectednode {
					outline: 2px solid $main-red-color;
					outline-offset: 2px;
				}
			}

			.is-editor-empty:first-child::before {
				content: attr(data-placeholder);
				color: rgba(17, 24, 39, 0.38);
				pointer-events: none;
				float: left;
				height: 0;
			}
		}
	}

	&__link-dialog {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.75rem;
		border-top: 1px solid rgba(17, 24, 39, 0.1);
		background: rgba(17, 24, 39, 0.02);
		border-radius: 0 0 10px 10px;
	}

	&__link-input {
		flex: 1;
		padding: 0.45rem 0.7rem;
		border-radius: 8px;
		border: 1px solid rgba(17, 24, 39, 0.18);
		background: #ffffff;
		color: #111827;
		font-size: 0.85rem;
		outline: none;

		&:focus {
			border-color: rgba($main-red-color, 0.7);
			box-shadow: 0 0 0 3px rgba($main-red-color, 0.1);
		}
	}

	&__link-apply {
		padding: 0.45rem 0.85rem;
		border-radius: 8px;
		border: 1px solid rgba($main-red-color, 0.5);
		background: transparent;
		color: $main-red-color;
		font-size: 0.85rem;
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.15s ease;

		&:hover {
			background: rgba($main-red-color, 0.08);
		}
	}

	&__link-cancel {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: 1px solid rgba(17, 24, 39, 0.14);
		background: transparent;
		color: rgba(17, 24, 39, 0.55);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		transition: background 0.15s ease, color 0.15s ease;

		&:hover {
			background: rgba(17, 24, 39, 0.07);
			color: #111827;
		}
	}
}

.rte-fade-enter-active,
.rte-fade-leave-active {
	transition: opacity 0.15s ease, transform 0.15s ease;
}

.rte-fade-enter-from,
.rte-fade-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
