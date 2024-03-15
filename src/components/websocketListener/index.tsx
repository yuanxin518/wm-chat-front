"use client"

import { notification } from "antd"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

enum EVENT_TYPE {
	"AUTH_FAIL" = "AUTH_FAIL",
	"AUTH_SUCCESS" = "AUTH_SUCCESS"
}
type ResponseType = {
	event: EVENT_TYPE
	data: string
	message: string
}

interface IProps {
	children: React.ReactNode
}

const WebsocketListener: React.FC<IProps> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		setIsLoading(true)

		const token = localStorage.getItem("wm-token")
		const ws = new WebSocket(
			"ws://localhost:81",
			token ? [token || ""] : undefined
		)

		ws.onerror = () => {
			notification.error({
				message: "服务器可能出现了异常"
			})
		}

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
