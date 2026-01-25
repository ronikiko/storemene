import { db } from '../src/db/index.js'
import { sql } from 'drizzle-orm'

async function addColumn() {
	try {
		console.log('Adding external_id column to customers table...')
		await db.execute(
			sql`ALTER TABLE "customers" ADD COLUMN IF NOT EXISTS "external_id" integer;`,
		)
		console.log('✅ Column added successfully (or already exists).')
		process.exit(0)
	} catch (err) {
		console.error('❌ Error adding column:', err.message)
		process.exit(1)
	}
}

addColumn()
