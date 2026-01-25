import { db } from '../src/db/index.js'
import { sql } from 'drizzle-orm'
import dotenv from 'dotenv'

dotenv.config()

async function createUsersTable() {
	console.log('Creating users table...')
	try {
		await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "password_hash" text NOT NULL,
        "role" text DEFAULT 'admin' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `)
		console.log('✓ Users table created successfully')
		process.exit(0)
	} catch (error) {
		console.error('Error creating users table:', error)
		process.exit(1)
	}
}

createUsersTable()
