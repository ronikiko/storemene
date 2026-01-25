import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const authMiddleware = (req, res, next) => {
	const adminToken = req.cookies.admin_token
	const customerToken = req.cookies.customer_token

	if (!adminToken && !customerToken) {
		return res.status(401).json({ error: 'Authentication required' })
	}

	try {
		const token = adminToken || customerToken
		const decoded = jwt.verify(token, JWT_SECRET)
		req.user = decoded
		req.isAdmin = !!adminToken
		req.isCustomer = !!customerToken
		next()
	} catch (error) {
		res.clearCookie('admin_token')
		res.clearCookie('customer_token')
		return res.status(401).json({ error: 'Invalid or expired token' })
	}
}

export const adminMiddleware = (req, res, next) => {
	authMiddleware(req, res, () => {
		if (!req.isAdmin) {
			return res.status(403).json({ error: 'Admin access required' })
		}
		next()
	})
}
