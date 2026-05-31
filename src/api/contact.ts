import { http } from './http';

export type ContactTopic = 'order' | 'support';

export interface ContactFormData {
	name: string;
	email: string;
	message: string;
	topic: ContactTopic;
}

export const contactApi = {
	sendMessage: (data: ContactFormData) => http.post<{ ok: true }>('/api/contact', data),
};
