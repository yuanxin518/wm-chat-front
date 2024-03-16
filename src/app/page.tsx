"use client"
import theme from "@/theme/themeConfig"
import { ConfigProvider, Input, Spin, Tag, notification } from "antd"
import "./index.scss"
import MessageItem from "@/components/messageItem"
import WebsocketListener, { WsContext } from "@/components/websocketListener"
import { useRouter, useSearchParams } from "next/navigation"
import {
	KeyboardEvent,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from "react"
import { v4 } from "uuid"
import url from "@/apis/url"

type MsgItem = {
	id?: string
	username?: string
	self?: boolean
	msg?: string
}

export default function Home() {
	const router = useRouter()
	const pathName = useSearchParams()
	const id = pathName?.get("id")
	const [isLoadding, setIsLoadding] = useState(false)
	const [isFetching, setIsFetching] = useState(false)
	const msgArea = useRef<HTMLDivElement | null>(null)
	const ws = useContext(WsContext)
	const [msgList, setMsgList] = useState<MsgItem[]>([])
	const [userInfo, setUserInfo] = useState({
		userId: "",
		username: "",
		type: ""
	})

	useEffect(() => {
		if (!isFetching) {
			setIsLoadding(false)
		}
	}, [isFetching])

	useEffect(() => {
		if (!msgArea.current) return
		msgArea.current.scrollTop = msgArea.current.scrollHeight
	})

	useEffect(() => {
		if (!id) return

		const token = localStorage.getItem("wm-token") as string
		const fetchUser = async () => {
			setIsFetching(true)

			const myHeaders = new Headers()
			myHeaders.append("Content-Type", "application/json")
			myHeaders.append("wm-chat-token", token)
			const body = JSON.stringify({
				userId: id
			})

			await fetch(url.PROFILE, {
				method: "POST",
				body,
				headers: myHeaders
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.data.success) {
						setUserInfo(res.data.data)
					} else {
						notification.error({
							message: res.data.message
						})
					}
				})
		}

		const fetchMsg = async () => {
			const myHeaders = new Headers()
			myHeaders.append("Content-Type", "application/json")
			myHeaders.append("wm-chat-token", token)
			const body = JSON.stringify({
				targetUserId: id
			})

			await fetch(url.MSG_DETAIL, {
				method: "POST",
				body,
				headers: myHeaders
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.data.success) {
						const msgList = res.data.data.map((item: any) => {
							return {
								id: item.messageId,
								self: item.self,
								msg: item.message
							}
						})
						setMsgList(msgList)
					} else {
						notification.error({
							message: res.data.message
						})
					}
				})
		}
		;(async () => {
			await fetchMsg()
			await fetchUser()
		})().finally(() => {
			setIsFetching(false)
		})
	}, [id])

	const handlePressEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!id) return

		ws.sendMsg(id, e.currentTarget.value)
		e.currentTarget.value = ""
	}

	const renderMsg = () => {
		return (
			<>
				{msgList.map((item) => (
					<MessageItem {...item} key={item.id} />
				))}
			</>
		)
	}

	const setMsg = useCallback(
		(data: any) => {
			;((!data.self && data.userId === id) || data.self) &&
				setMsgList([
					...msgList,
					{
						id: data.id,
						username: data.targetUserId,
						self: data.self,
						msg: data.msg
					}
				])
		},
		[msgList, id]
	)

	useEffect(() => {
		const key = v4()
		ws &&
			ws.subscribeMsg &&
			ws.subscribeMsg((res: any) => {
				setMsg(res || {})
			}, key)

		return () => {
			ws.unSubscribeMsg(key)
		}
	}, [ws, setMsg])

	useEffect(() => {
		const listenStorage = () => {
			const token = localStorage.getItem("wm-token")
			if (!token) {
				router.push("/login")
			}
		}
		listenStorage()
		window.addEventListener("storage", listenStorage)

		return () => window.removeEventListener("storage", listenStorage)
	}, [router])

	return (
		<ConfigProvider theme={theme}>
			<WebsocketListener>
				<div className="home__main">
					<div className="chat__pane">
						<div className="chat__msg-title">
							{userInfo.type && (
								<Tag color="#108ee9">
									{userInfo.type === "user" ? "好友" : "群聊"}
								</Tag>
							)}
							{userInfo.username || "加载中"}
						</div>
						<div className="chat__msg-container" ref={msgArea}>
							{isLoadding ? (
								<div
									style={{
										height: "100%",
										width: "100%",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center"
									}}
								>
									<Spin tip="消息加载中" size="large">
										<span></span>
									</Spin>
								</div>
							) : (
								renderMsg()
							)}
						</div>
						<Input.TextArea
							maxLength={9999}
							showCount={false}
							className="chat__input"
							rows={4}
							style={{ resize: "none" }}
							onPressEnter={(e) => handlePressEnter(e)}
						/>
					</div>
				</div>
			</WebsocketListener>
		</ConfigProvider>
	)
}
