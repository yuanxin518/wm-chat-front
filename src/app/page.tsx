"use client"
import theme from "@/theme/themeConfig"
import { ConfigProvider, Input } from "antd"
import "./index.scss"
import MessageItem from "@/components/messageItem"
import WebsocketListener from "@/components/websocketListener"

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
	}
]

export default function Home() {
	return (
		<ConfigProvider theme={theme}>
			<WebsocketListener>
				<div className="home__main">
					<div className="chat__pane">
						<div className="chat__msg-container">
							{testMsg.map((item) => (
								<MessageItem {...item} key={item.id} />
							))}
						</div>
						<Input.TextArea
							maxLength={9999}
							showCount={false}
							className="chat__input"
							rows={4}
							style={{ resize: "none" }}
							onPressEnter={(e) => e.preventDefault()}
						></Input.TextArea>
					</div>
				</div>
			</WebsocketListener>
		</ConfigProvider>
	)
}
