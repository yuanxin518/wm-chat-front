"use client"
import { Avatar, List, Tooltip, Typography } from "antd"
import "./index.css"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import url from "@/apis/url"

const FriendBook = () => {
	const router = useRouter()
	const [friends, setFriends] = useState<
		{
			userId: string
			username: string
		}[]
	>([])

	useEffect(() => {
		const myHeaders = new Headers()
		myHeaders.append("Content-Type", "application/json")
		myHeaders.append(
			"wm-chat-token",
			localStorage.getItem("wm-token") || ""
		)
		fetch(url.FRIEND, {
			method: "POST",
			headers: myHeaders
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.data && res.data.data) {
					setFriends(res.data.data)
				}
			})
	}, [])

	return (
		<List
			style={{
				height: "100%",
				overflow: "auto"
			}}
			itemLayout="horizontal"
			dataSource={friends}
			renderItem={(item, index) => (
				<List.Item
					className="list_item"
					onClick={() => {
						router.push(`/?id=${item.userId}`)
					}}
				>
					<List.Item.Meta
						avatar={
							<Avatar
								shape="circle"
								src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
							/>
						}
						title={
							<Typography.Text ellipsis>
								{item.username}
							</Typography.Text>
						}
						description={
							<div>
								<p
									style={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis"
									}}
								>{`Ant Design, a design language for background
								applications, is refined by Ant UED Team`}</p>
							</div>
						}
					/>
				</List.Item>
			)}
		/>
	)
}

export default FriendBook
