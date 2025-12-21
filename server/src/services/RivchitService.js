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
		const response = await fetch(
			'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Document.TypeList',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					api_token: this.apiToken,
				}),
			}
		)
		const data = await response.json()
		if (data.error_code === 0) {
			return data.data.document_type_list.find((item) => {
				if (item.document_name === this.documentsTypes[type].document_name) {
					return item.document_type
				}
			})
		}
	}

	async createNewOrder(orderData) {
		const documentType = await this.documentsType('ORDER')
		const res = await fetch(
			'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Document.New',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
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
				}),
			}
		)
		const data = await res.json()
		if (data.error_code === 0) {
			return data.data
		}
	}

	async customersTypesList() {
		try {
			const response = await fetch(
				'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Customer.TypeList',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						api_token: this.apiToken,
					}),
				}
			)
			const data = await response.json()
			if (data.error_code === 0) {
				return data.data.customer_type_list
			}
			/** customersTypes List response **
   [
        { customer_type: 0, customer_type_name: 'כללי' },
        { customer_type: 1, customer_type_name: 'לקוחות' },
        { customer_type: 2, customer_type_name: 'חבר בית כנסת ' },
        { customer_type: 3, customer_type_name: 'חבר מזדמן ' },
        { customer_type: 4, customer_type_name: 'דרכים' },
        { customer_type: 19, customer_type_name: 'לקוחות-סוף' },
        { customer_type: 20, customer_type_name: 'ספקים' },
        { customer_type: 21, customer_type_name: 'שחקנים' },
        { customer_type: 22, customer_type_name: 'ספק - שתיה' },
        { customer_type: 39, customer_type_name: 'ספקים-סוף' },
        { customer_type: 40, customer_type_name: 'הכנסות' },
        { customer_type: 41, customer_type_name: 'עלות המכר' },
        { customer_type: 42, customer_type_name: 'הוצאות הפעלה' },
        { customer_type: 43, customer_type_name: "_IList' הנהלה " },
        { customer_type: 44, customer_type_name: 'הוצאות מימון' },
        { customer_type: 59, customer_type_name: 'רווח והפסד סוף' },
        { customer_type: 60, customer_type_name: 'סוכנים' },
        { customer_type: 99, customer_type_name: 'בנק/בעלי העסק' }
    ]
*/
		} catch (error) {
			console.log(error)
		}
	}

	async customersList() {
		try {
			const response = await fetch(
				'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Customer.List',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						api_token: this.apiToken,
					}),
				}
			)
			const data = await response.json()
			if (data.error_code === 0) {
				return data.data.customer_list
			}
			/* customer list response example **
    [{
        customer_id: 350,
        last_name: 'ספק קור',
        first_name: '',
        street: '',
        city: '',
        zipcode: '0',
        country: '',
        phone: '',
        phone2: '',
        fax: '',
        email: '',
        id_number: 0,
        vat_number: 0,
        customer_type: 20,
        price_list_id: 0,
        agent_id: 0,
        project_id: null,
        discount_percent: 0,
        acc_ref: '350',
        exempt_vat: false,
        comments: '',
        available_from: '15:27:23',
        available_to: '15:27:23',
        credit_terms: 1,
        credit_days: 0,
        due_date: '20/12/2025',
        pob: 0,
        pal_code: 30,
        paying_customer_id: 0,
        is_registered: false,
        balance: 0,
        currency_id: 1,
        cc_token: null
}]
*/
		} catch (error) {
			console.log(error)
		}
	}
}

export const rivchitService = new RivchitService()
