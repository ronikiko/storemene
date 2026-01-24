import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

class WhatsAppService {
	constructor() {
		this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN
		this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
		this.version = process.env.WHATSAPP_VERSION || 'v21.0'
		this.baseUrl = `https://graph.facebook.com/${this.version}/${this.phoneNumberId}/messages`
	}

	/**
	 * Send a plain text message
	 * @param {string} to - Recipient phone number (e.g., '972543087670')
	 * @param {string} message - The text message to send
	 * @returns {Promise<Object>} - API response
	 */
	async sendMessage(to, message) {
		try {
			const response = await axios.post(
				this.baseUrl,
				{
					messaging_product: 'whatsapp',
					recipient_type: 'individual',
					to: to,
					type: 'text',
					text: {
						preview_url: false,
						body: message,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
						'Content-Type': 'application/json',
					},
				},
			)

			return response.data
		} catch (error) {
			const data = error.response?.data
			console.error(
				'WhatsApp Service Error (sendMessage):',
				data || error.message,
			)
			throw new Error(
				data?.error?.message ||
					error.message ||
					'Failed to send WhatsApp message',
			)
		}
	}

	/**
	 * Send a message using a template
	 * @param {string} to - Recipient phone number
	 * @param {string} templateName - Name of the template
	 * @param {string} languageCode - Language code (e.g., 'he', 'en_US')
	 * @param {Array} components - Template components (optional)
	 * @returns {Promise<Object>} - API response
	 */
	async sendTemplateMessage(
		to,
		templateName,
		languageCode = 'en_US',
		components = [],
	) {
		try {
			const response = await axios.post(
				this.baseUrl,
				{
					messaging_product: 'whatsapp',
					recipient_type: 'individual',
					to: to,
					type: 'template',
					template: {
						name: templateName,
						language: {
							code: languageCode,
						},
						components: components,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
						'Content-Type': 'application/json',
					},
				},
			)

			return response.data
		} catch (error) {
			const data = error.response?.data
			console.error(
				'WhatsApp Service Error (sendTemplateMessage):',
				data || error.message,
			)
			throw new Error(
				data?.error?.message ||
					error.message ||
					'Failed to send WhatsApp template message',
			)
		}
	}
}

export const whatsAppService = new WhatsAppService()
