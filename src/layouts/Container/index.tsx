"use client"
import React, { ReactNode, useState } from "react"
import "./index.scss"
import FriendBook from "@/components/friendBook"
import { Layout, Button, theme, Menu, Dropdown, MenuProps, Space } from "antd"
const { Header, Sider, Content } = Layout
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined
	// @ts-ignore
} from "@ant-design/icons"
import { usePathname, useRouter } from "next/navigation"
interface IProps {
	children: ReactNode
}

const Container: React.FC<IProps> = (props) => {
	const router = useRouter()
	const [collapsed, setCollapsed] = useState(false)
	const {
		token: { colorBgContainer }
	} = theme.useToken()
	const pathName = usePathname()
	const isLogin = pathName.includes("/login")

	const items: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					onClick={() => {
						router.push("/user")
					}}
				>
					用户详情
				</a>
			)
		},
		{
			key: "2",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					onClick={() => {
						router.push("/admin")
					}}
				>
					管理界面
				</a>
			)
		}
	]

	return (
		<>
			{isLogin ? (
				props.children
			) : (
				<Layout>
					<Sider
						width={200}
						theme="light"
						trigger={null}
						collapsedWidth={100}
						collapsible
						collapsed={collapsed}
					>
						<div className="demo-logo-vertical" />
						<FriendBook />
					</Sider>
					<Layout
						style={{
							borderLeft: "1px solid rgba(0,0,0,0.1)"
						}}
					>
						<Header
							style={{
								padding: 0,
								background: colorBgContainer,
								borderBottom: "1px solid rgba(0,0,0,0.1)"
							}}
						>
							<Button
								type="text"
								icon={
									collapsed ? (
										<MenuUnfoldOutlined />
									) : (
										<MenuFoldOutlined />
									)
								}
								onClick={() => setCollapsed(!collapsed)}
								style={{
									fontSize: "16px",
									width: 40,
									height: 40
								}}
							/>
							<Dropdown menu={{ items }} trigger={["click"]}>
								<a onClick={(e) => e.preventDefault()}>菜单</a>
							</Dropdown>
						</Header>
						<Content className="container">
							<div className="container-right">
								{props.children}
							</div>
						</Content>
					</Layout>
				</Layout>
			)}
		</>
	)
}

export default Container
