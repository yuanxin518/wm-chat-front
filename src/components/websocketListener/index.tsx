"use client"

import { notification } from "antd"
import { useRouter } from "next/navigation"
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from "react"

const TOKEN = "wm-token"

enum EVENT_TYPE {
	"AUTH_FAIL" = "AUTH_FAIL",
	"AUTH_SUCCESS" = "AUTH_SUCCESS",
	"RECEIVE_MSG" = "RECEIVE_MSG",
	"SEND_MSG_SUCCESS" = "SEND_MSG_SUCCESS"
}
type ResponseType = {
	event: EVENT_TYPE
	data: {
		userId: string
		targetUserId: string
		msg: string
	}
	msg: string
}

interface IProps {
	children: React.ReactNode
}

export const WsContext = createContext<any>({})

const WebsocketListener: React.FC<IProps> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
	const ws = useRef<WebSocket | null>(null)
	const wsContext = useContext(WsContext)
	const subscribeList = useRef(new Map())

	useEffect(() => {
		setIsLoading(true)

		const token = localStorage.getItem(TOKEN)

		ws.current = new WebSocket(
			"ws://localhost:81",
			token ? [token || ""] : undefined
		)

		wsContext.sendMsg = (targetUserId: number, msg: string) => {
			ws.current?.send(
				JSON.stringify({
					event: "send-msg",
					data: {
						targetUserId,
						msg,
						token: localStorage.getItem(TOKEN)
					}
				})
			)
		}

		wsContext.subscribeMsg = (callback: () => void, key: string) => {
			subscribeList.current.set(key, callback)
		}

		wsContext.unSubscribeMsg = (key: string) => {
			subscribeList.current.delete(key)
		}

		wsContext.publishMsg = (data: any) => {
			subscribeList.current.forEach((callback) => {
				if (callback instanceof Function) {
					callback(data)
					console.log(data)
				}
			})
		}

		ws.current.onerror = () => {
			notification.error({
				message: "服务器可能出现了异常"
			})
		}

		ws.current.addEventListener("message", (event) => {
			const res: ResponseType = JSON.parse(event.data)

			switch (res.event) {
				case EVENT_TYPE.AUTH_FAIL:
					router.push("login")
					break
				case EVENT_TYPE.AUTH_SUCCESS:
					setIsLoading(false)
					break
				case EVENT_TYPE.SEND_MSG_SUCCESS:
				case EVENT_TYPE.RECEIVE_MSG:
					wsContext?.publishMsg(res.data)
					break
			}
		})

		ws.current.addEventListener("open", () => {
			if (ws.current?.readyState === WebSocket.OPEN) {
				ws.current?.send(
					JSON.stringify({
						event: "join",
						data: {
							token: localStorage.getItem(TOKEN) || ""
						}
					})
				)
			}
		})

		ws.current.addEventListener("close", () => {
			notification.info({
				message: "与服务器断开连接，请重新登录"
			})
			router.push("/login")
		})
	}, [router, wsContext, ws])

	return (
		<>
			{isLoading ? null : (
				<WsContext.Provider value={null}>{children}</WsContext.Provider>
			)}
		</>
	)
}

export default WebsocketListener
