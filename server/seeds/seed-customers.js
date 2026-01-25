import { db } from '../src/db/index.js'
import { customers } from '../src/db/schema.js'
import { rivchitService } from '../src/services/rivchit/RivchitService.js'
import crypto from 'crypto'

/**
 * Seeds customers from Rivchit API to the local database.
 * Maps first_name and last_name to a single name field.
 * Generates unique tokens and random PINs for new customers.
 *
 * NOTE: This function does NOT overwrite existing tokens or PINs during updates.
 */
export async function seedCustomers() {
	try {
		console.log('Fetching customers from Rivchit...')
		const rivchitCustomers = await rivchitService.customersList()

		if (!rivchitCustomers || rivchitCustomers.length === 0) {
			console.log('No customers found in Rivchit.')
			return
		}

		console.log(`Processing ${rivchitCustomers.length} customers...`)

		let processedCount = 0
		for (const rc of rivchitCustomers) {
			// Map Rivchit data to our schema
			const fullName = `${rc.first_name || ''} ${rc.last_name || ''}`.trim()

			// Generate defaults for new customers
			const customerData = {
				id: rc.customer_id.toString(),
				name: fullName || 'Unnamed Customer',
				email: rc.email || 'no-email@example.com',
				phone: rc.phone || rc.phone2 || '000-0000000',
				priceListId: rc.price_list_id ? rc.price_list_id.toString() : null,
				externalId: rc.customer_id,
				token: crypto.randomBytes(24).toString('hex'), // Secure unique token
				pin: Math.floor(1000 + Math.random() * 9000).toString(), // Random 4-digit PIN
			}

			// Insert or update basic info
			// Note: We don't update 'token' and 'pin' on conflict to avoid overwriting existing credentials
			await db
				.insert(customers)
				.values(customerData)
				.onConflictDoUpdate({
					target: customers.id,
					set: {
						name: customerData.name,
						email: customerData.email,
						phone: customerData.phone,
						priceListId: customerData.priceListId,
						externalId: customerData.externalId,
					},
				})

			processedCount++
			if (processedCount % 10 === 0) {
				console.log(
					`Processed ${processedCount}/${rivchitCustomers.length} customers...`,
				)
			}
		}

		console.log(`✅ ${processedCount} customers synced successfully!`)
	} catch (error) {
		console.error('❌ Error seeding customers:', error.message)
		throw error
	}
}

// Add this block to run the function when the script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedCustomers()
		.then(() => process.exit(0))
		.catch((err) => {
			console.error(err)
			process.exit(1)
		})
}
