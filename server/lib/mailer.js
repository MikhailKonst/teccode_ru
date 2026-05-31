import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
	if (transporter) return transporter;

	const host = String(process.env.SMTP_HOST ?? '').trim();
	const port = Number(process.env.SMTP_PORT ?? 587);
	const user = String(process.env.SMTP_USER ?? '').trim();
	const pass = String(process.env.SMTP_PASS ?? '').trim();

	if (!host || !user || !pass) return null;

	// По умолчанию TLS-сертификат проверяется. Отключить можно только явно
	// через SMTP_ALLOW_INSECURE_TLS=1 (например, для самоподписанных сертификатов в dev).
	const allowInsecure = String(process.env.SMTP_ALLOW_INSECURE_TLS ?? '').trim() === '1';

	transporter = nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
		...(allowInsecure ? { tls: { rejectUnauthorized: false } } : {}),
		connectionTimeout: 15000,
		greetingTimeout: 20000,
		socketTimeout: 25000,
	});

	return transporter;
}

export function isMailConfigured() {
	return getTransporter() !== null;
}

// Проверка соединения и аутентификации SMTP. Возвращает { ok, reason } без throw,
// чтобы причину можно было залогировать при старте сервера.
export async function verifyMail() {
	const t = getTransporter();
	if (!t) return { ok: false, reason: 'not_configured' };
	try {
		await t.verify();
		return { ok: true };
	} catch (err) {
		return { ok: false, reason: err?.code || err?.message || 'verify_failed' };
	}
}

function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

const TOPIC_LABELS = {
	order:   'Заказ продукта',
	support: 'Техническая поддержка',
};

export async function sendContactEmail({ name, email, message, topic = 'order' }) {
	const t = getTransporter();
	if (!t) {
		console.warn('[mailer] SMTP не настроен — письмо не отправлено');
		return false;
	}

	const mailOrders  = String(process.env.MAIL_TO_ORDERS  ?? 'info@teccode.ru').trim();
	const mailSupport = String(process.env.MAIL_TO_SUPPORT ?? 'support@teccode.ru').trim();
	const to   = topic === 'support' ? mailSupport : mailOrders;
	const from = String(process.env.SMTP_FROM ?? process.env.SMTP_USER ?? '').trim();
	const topicLabel = TOPIC_LABELS[topic] ?? topic;

	await t.sendMail({
		from,
		to,
		replyTo: email,
		subject: `[${topicLabel}] Заявка от ${escapeHtml(name)}`,
		html: `
			<div style="font-family:sans-serif;max-width:560px">
				<h2 style="color:#222;margin-bottom:4px">Новая заявка с сайта TechCode</h2>
				<p style="color:#888;margin-top:0;font-size:13px">Тема: <strong>${topicLabel}</strong></p>
				<hr style="border:none;border-top:1px solid #eee;margin:16px 0">
				<p><strong>Имя:</strong> ${escapeHtml(name)}</p>
				<p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
				<p><strong>Сообщение:</strong></p>
				<p style="background:#f5f5f5;padding:12px;border-radius:6px;line-height:1.6">
					${escapeHtml(message).replace(/\n/g, '<br>')}
				</p>
				<hr style="border:none;border-top:1px solid #eee;margin:16px 0">
				<p style="color:#aaa;font-size:12px">Ответьте на это письмо — ответ уйдёт напрямую отправителю.</p>
			</div>
		`,
	});

	return true;
}
