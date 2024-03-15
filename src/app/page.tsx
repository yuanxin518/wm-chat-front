"use client"
import theme from "@/theme/themeConfig"
import { ConfigProvider, Input, Spin } from "antd"
import "./index.scss"
import MessageItem from "@/components/messageItem"
import WebsocketListener from "@/components/websocketListener"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const testMsg = [
	{
		id: 1,
		useName: "测试用户",
		self: true,
		msg: "你好"
	},
	{
		id: 2,
		useName: "老王",
		msg: "你也是"
	},
	{
		id: 3,
		useName: "王五",
		msg: "大家好啊"
	},
	{
		id: 4,
		useName: "测试用户",
		self: true,
		msg: "你好"
	},
	{
		id: 5,
		useName: "老王",
		msg: "你也是"
	},
	{
		id: 6,
		useName: "王五",
		msg: "大家好啊"
	},
	{
		id: 7,
		useName: "测试用户",
		self: true,
		msg: "你好"
	},
	{
		id: 8,
		useName: "老王",
		msg: "你也是"
	},
	{
		id: 9,
		useName: "王五",
		msg: "大家好啊"
	},
	{
		id: 10,
		useName: "测试用户",
		self: true,
		msg: "你好"
	},
	{
		id: 11,
		useName: "老王",
		msg: "你也是"
	},
	{
		id: 12,
		useName: "王五",
		msg: "大家好啊"
	}
]

export default function Home() {
	const pathName = useSearchParams()
	const id = pathName?.get("id")
	const [isLoadding, setIsLoadding] = useState(true)
	const msgArea = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		setIsLoadding(true)
	}, [id])

	useEffect(() => {
		if (!msgArea.current) return
		msgArea.current.scrollTop = msgArea.current.scrollHeight
	})

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
								<>
									{testMsg.map((item) => (
										<MessageItem {...item} key={item.id} />
									))}
								</>
							)}
						</div>
						<Input.TextArea
							maxLength={9999}
							showCount={false}
							className="chat__input"
							rows={4}
							style={{ resize: "none" }}
							onPressEnter={(e) => e.preventDefault()}
						/>
					</div>
				</div>
			</WebsocketListener>
		</ConfigProvider>
	)
}
