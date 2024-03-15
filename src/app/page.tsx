"use client"
import theme from "@/theme/themeConfig"
import { ConfigProvider, Input, Spin } from "antd"
import "./index.scss"
import MessageItem from "@/components/messageItem"
import WebsocketListener, { WsContext } from "@/components/websocketListener"
import { useSearchParams } from "next/navigation"
import {
	KeyboardEvent,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from "react"
import { v4 } from "uuid"

type MsgItem = {
	id?: string
	username?: string
	self?: boolean
	msg?: string
}

export default function Home() {
	const pathName = useSearchParams()
	const id = pathName?.get("id")
	const [isLoadding, setIsLoadding] = useState(false)
	const msgArea = useRef<HTMLDivElement | null>(null)
	const ws = useContext(WsContext)
	const [msgList, setMsgList] = useState<MsgItem[]>([])

	useEffect(() => {
		setIsLoadding(false)
	}, [id])

	useEffect(() => {
		if (!msgArea.current) return
		msgArea.current.scrollTop = msgArea.current.scrollHeight
	})

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
		[msgList]
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

	return (
		<ConfigProvider theme={theme}>
			<WebsocketListener>
				<div className="home__main">
					<div className="chat__pane">
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
