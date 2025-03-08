import Cookies from "js-cookie"
import { useState } from "react"

export default function useAuth() {
	const token = Cookies.get("crc-admin")
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

	const userLogin = (token: string) => {
		Cookies.set("crc-admin", token)

		setIsAuthenticated(true)
	}

	const userLogout = () => {
		Cookies.remove("crc-admin")

		setIsAuthenticated(false)
	}

	return { isAuthenticated, userLogin, userLogout }
}
