"use client"
import { Avatar, List, Tooltip, Typography } from "antd"
import "./index.css"
import { useRouter } from "next/navigation"

const data = [
	{
		title: "john",
		id: "65f4ace7c98347508bb72a7b"
	},
	{
		title: "maria",
		id: "65f4ace7c98347508bb72a7b"
	}
]

const FriendBook = () => {
	const router = useRouter()
	return (
		<List
			style={{
				height: "100%",
				overflow: "auto"
			}}
			itemLayout="horizontal"
			dataSource={data}
			renderItem={(item, index) => (
				<List.Item
					className="list_item"
					onClick={() => {
						router.push(`/?id=${item.id}`)
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
								{item.title}
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
