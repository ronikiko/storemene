import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

class TelegramService {
	constructor() {
		this.botToken = process.env.TELEGRAM_BOT_TOKEN
		this.defaultChatId = process.env.TELEGRAM_CHAT_ID
		this.baseUrl = `https://api.telegram.org/bot${this.botToken}`
	}

	/**
	 * Send a message to a Telegram chat
	 * @param {string} text - The message text to send
	 * @param {string|number} chatId - Recipient chat ID (optional, defaults to TELEGRAM_CHAT_ID)
	 * @param {Object} options - Additional Telegram send message options (optional)
	 * @returns {Promise<Object>} - API response
	 */
	async sendMessage(text, chatId = this.defaultChatId, options = {}) {
		if (!this.botToken) {
			console.error('Telegram Service Error: TELEGRAM_BOT_TOKEN is not defined')
			throw new Error('Telegram Bot Token is missing')
		}

		if (!chatId) {
			console.error('Telegram Service Error: chatId is not defined')
			throw new Error('Telegram Chat ID is missing')
		}

		try {
			const response = await axios.post(`${this.baseUrl}/sendMessage`, {
				chat_id: chatId,
				text: text,
				parse_mode: 'HTML',
				...options,
			})

			return response.data
		} catch (error) {
			const data = error.response?.data
			console.error(
				'Telegram Service Error (sendMessage):',
				data || error.message,
			)
			throw new Error(
				data?.description || error.message || 'Failed to send Telegram message',
			)
		}
	}
}

export const telegramService = new TelegramService()
