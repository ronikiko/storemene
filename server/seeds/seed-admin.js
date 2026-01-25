import { db } from '../src/db/index.js'
import { users } from '../src/db/schema.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

async function seedAdmin() {
	const email = 'admin@styleflow.com'
	const password = 'admin' // You should change this after first login
	const name = 'Admin User'

	console.log('Seed: Starting admin user creation...')

	try {
		const passwordHash = await bcrypt.hash(password, 10)

		await db
			.insert(users)
			.values({
				name,
				email,
				passwordHash,
				role: 'admin',
			})
			.onConflictDoNothing()

		console.log(`✓ Admin user created: ${email}`)
		process.exit(0)
	} catch (error) {
		console.error('Error seeding admin user:', error)
		process.exit(1)
	}
}

seedAdmin()
