import pkg from 'pg'
const { Client } = pkg
import dotenv from 'dotenv'

dotenv.config()

async function migrate() {
	const client = new Client({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	})

	try {
		await client.connect()
		console.log('Connected to database for migration')

		// Add picking_token to orders
		await client.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS picking_token TEXT;
    `)
		console.log('Added picking_token to orders')

		// Add picking_status to order_items
		await client.query(`
      ALTER TABLE order_items 
      ADD COLUMN IF NOT EXISTS picking_status TEXT NOT NULL DEFAULT 'pending';
    `)
		console.log('Added picking_status to order_items')

		console.log('Migration completed successfully')
	} catch (err) {
		console.error('Migration failed:', err)
	} finally {
		await client.end()
	}
}

migrate()
