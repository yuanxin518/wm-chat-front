"use client"
import { Avatar, Button, List, Tooltip, Typography, notification } from "antd"
import "./index.css"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import url from "@/apis/url"

const FriendBook = (props: { isAdmin?: boolean }) => {
	const router = useRouter()
	const [friends, setFriends] = useState<
		{
			title: string
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
					setFriends(
						res.data.data.map((item: any) => {
							return {
								...item,
								title: item.username
							}
						})
					)
				}
			})
	}, [])

	const handleDelete = (id: string) => {
		const myHeaders = new Headers()
		myHeaders.append("Content-Type", "application/json")

		const body = JSON.stringify({
			userId: id,
			username: "",
			password: ""
		})

		fetch(url.DELETE_USER, {
			method: "POST",
			body,
			headers: myHeaders
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.data.success) {
					router.refresh()
					notification.success({
						message: "删除成功"
					})
				} else {
					notification.error({
						message: "删除失败"
					})
				}
			})
	}

	return (
		<>
			<List
				grid={
					props.isAdmin
						? {
								gutter: 16,
								xs: 1,
								sm: 2,
								md: 4,
								lg: 4,
								xl: 6,
								xxl: 3
							}
						: undefined
				}
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
							!props.isAdmin && router.push(`/?id=${item.userId}`)
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
						/>
						<>
							{props.isAdmin && (
								<Button
									type="link"
									onClick={() => handleDelete(item.userId)}
								>
									删除
								</Button>
							)}
						</>
					</List.Item>
				)}
			/>
		</>
	)
}

export default FriendBook
