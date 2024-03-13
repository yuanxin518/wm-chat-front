"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

enum EVENT_TYPE {
	"AUTH_FAIL" = "AUTH_FAIL",
	"AUTH_SUCCESS" = "AUTH_SUCCESS"
}
type ResponseType = {
	event: EVENT_TYPE
	data: string
	msg: string
}

interface IProps {
	children: React.ReactNode
}

const WebsocketListener: React.FC<IProps> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		setIsLoading(true)

		localStorage.setItem(
			"token",
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoibWFyaWEiLCJwYXNzd29yZCI6Imd1ZXNzIiwiaWF0IjoxNzEwMzIxMTI1LCJleHAiOjE3MTAzMjExODV9.Xs11pvVe21NvOu6ssqtrt3YvZAfuhtjIhwUBt8SB0GE"
		)

		const ws = new WebSocket("ws://localhost:81", [
			localStorage.getItem("token") || ""
		])

		ws.addEventListener("open", () => {
			ws.send(
				JSON.stringify({
					event: "join",
					data: {
						token: localStorage.getItem("token") || ""
					}
				})
			)
		})

		ws.addEventListener("message", (event) => {
			const res: ResponseType = JSON.parse(event.data)
			switch (res.event) {
				case EVENT_TYPE.AUTH_FAIL:
					router.push("login")
					break
				case EVENT_TYPE.AUTH_SUCCESS:
					setIsLoading(false)
					break
			}
		})
	}, [router])

	return <>{isLoading ? null : children}</>
}

export default WebsocketListener
