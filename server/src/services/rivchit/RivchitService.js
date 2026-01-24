import axios from 'axios'

class RivchitService {
	constructor() {
		this.apiToken = 'DECD03E5-E35C-41E8-84F7-FBA2FB483928'
	}

	documentsTypes = {
		ORDER: {
			document_name: 'הזמנה',
		},
		INVOICE: {
			document_name: 'חשבונית מס',
		},
	}

	async documentsType(type) {
		try {
			const response = await axios.post(
				'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Document.TypeList',
				{
					api_token: this.apiToken,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			const data = response.data
			if (data.error_code === 0) {
				return data.data.document_type_list.find((item) => {
					if (item.document_name === this.documentsTypes[type].document_name) {
						return item.document_type
					}
				})
			}
		} catch (error) {
			console.error('Rivchit Service Error (documentsType):', error.message)
			throw error
		}
	}

	async createNewOrder(orderData) {
		try {
			const documentType = await this.documentsType('ORDER')
			const response = await axios.post(
				'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Document.New',
				{
					api_token: this.apiToken,
					first_name: orderData.customerName,
					last_name: orderData.customerLastName || orderData.customerName,
					customer_id: 0,
					document_type: documentType.document_type,
					price_include_vat: true,
					discount_value: orderData.discountPercent || 0,
					items: [
						...orderData.items.map((item, index) => ({
							item_id: index + 1,
							quantity: item.quantity,
							catalog_number: item.productId,
							price_nis: item.price,
							price_mtc: item.price,
							discount_percent: item.discountPercent || 0,
							description: item.title,
						})),
					],
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			const data = response.data
			if (data.error_code === 0) {
				return data.data
			}
		} catch (error) {
			console.error('Rivchit Service Error (createNewOrder):', error.message)
			throw error
		}
	}

	async customersTypesList() {
		try {
			const response = await axios.post(
				'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Customer.TypeList',
				{
					api_token: this.apiToken,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			const data = response.data
			if (data.error_code === 0) {
				return data.data.customer_type_list
			}
		} catch (error) {
			console.error(
				'Rivchit Service Error (customersTypesList):',
				error.message,
			)
		}
	}

	async customersList() {
		try {
			const response = await axios.post(
				'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Customer.List',
				{
					api_token: this.apiToken,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			const data = response.data
			if (data.error_code === 0) {
				return data.data.customer_list
			}
		} catch (error) {
			console.error('Rivchit Service Error (customersList):', error.message)
		}
	}
}

export const rivchitService = new RivchitService()
