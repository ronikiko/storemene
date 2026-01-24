import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../../.env') })

import { telegramService } from './TelegramService.js'
try {
	const result = await telegramService.sendMessage(
		'Hello from StyleFlow via Telegram!',
	)
	console.log('Telegram message sent:', result)
} catch (error) {
	console.error('Telegram test failed:', error.message)
}
