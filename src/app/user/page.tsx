"use client"
import React, { useEffect } from "react"
import {
	Button,
	Form,
	type FormProps,
	Input,
	notification,
	DescriptionsProps
} from "antd"
import url from "@/apis/url"
import { useRouter } from "next/navigation"

type FieldType = {
	username?: string
	password?: string
	remember?: string
}

const User: React.FC = () => {
	const router = useRouter()

	const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
		const { username, password } = values

		const myHeaders = new Headers()
		myHeaders.append("Content-Type", "application/json")
		myHeaders.append(
			"wm-chat-token",
			localStorage.getItem("wm-token") || ""
		)

		const body = JSON.stringify({
			username,
			password
		})

		await fetch(url.UPDATE, {
			method: "POST",
			body,
			headers: myHeaders
		})
			.then((res: any) => res.json())
			.then((res) => {
				if (res.data.success) {
					notification.success({
						message: "修改成功"
					})

					localStorage.removeItem("wm-token")
					router.push("/login")
				} else {
					notification.error({
						message: "修改失败"
					})
					return
				}
			})
	}

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				backgroundColor: "#FFF",
				padding: "40px",
				flexDirection: "column"
			}}
		>
			<div
				style={{
					fontWeight: "bold",
					fontSize: 24,
					marginBottom: 40
				}}
			>
				修改用户信息
			</div>
			<Form
				name="basic"
				style={{ maxWidth: 800 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				autoComplete="off"
			>
				<Form.Item<FieldType>
					label="用户名"
					name="username"
					rules={[{ required: true, message: "输入账号" }]}
				>
					<Input />
				</Form.Item>

				<Form.Item<FieldType>
					label="密码"
					name="password"
					rules={[{ required: true, message: "输入密码" }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						提交修改
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default User
