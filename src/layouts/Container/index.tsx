"use client"
import React, { ReactNode, useState } from "react"
import "./index.scss"
import FriendBook from "@/components/friendBook"
import { Layout, Button, theme } from "antd"
const { Header, Sider, Content } = Layout
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined
	// @ts-ignore
} from "@ant-design/icons"
import { usePathname } from "next/navigation"
interface IProps {
	children: ReactNode
}

const Container: React.FC<IProps> = (props) => {
	const [collapsed, setCollapsed] = useState(false)
	const {
		token: { colorBgContainer }
	} = theme.useToken()
	const pathName = usePathname()
	const isLogin = pathName.includes("/login")

	return (
		<>
			{isLogin ? (
				props.children
			) : (
				<Layout>
					<Sider
						width={300}
						theme="light"
						trigger={null}
						collapsedWidth={200}
						collapsible
						collapsed={collapsed}
					>
						<div className="demo-logo-vertical" />
						<FriendBook />
					</Sider>
					<Layout>
						<Header
							style={{ padding: 0, background: colorBgContainer }}
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
