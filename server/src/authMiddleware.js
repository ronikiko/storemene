import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const authMiddleware = (req, res, next) => {
	const token = req.cookies.admin_token

	if (!token) {
		return res.status(401).json({ error: 'Authentication required' })
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		req.user = decoded
		next()
	} catch (error) {
		res.clearCookie('admin_token')
		return res.status(401).json({ error: 'Invalid or expired token' })
	}
}
