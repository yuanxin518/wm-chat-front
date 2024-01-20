import React from "react"
import "./index.scss"
import { Avatar } from "antd"

interface IProps {
	useName?: string
	msg?: string
	self?: boolean //是否是本人发送信息
}
const MessageItem: React.FC<IProps> = (props) => {
	const { self, msg, useName } = props

	return (
		<section className={`msg__item ${self && "msg__item--self"}`}>
			<Avatar
				className="msg__avatar"
				shape="circle"
				style={{ backgroundColor: "#1677ff" }}
			>
				{useName || ""}
			</Avatar>
			<div className="msg__content">
				<div className="msg__content-name">{useName || ""}</div>
				<div className="msg__content-text">{msg || ""}</div>
			</div>
		</section>
	)
}

export default MessageItem
