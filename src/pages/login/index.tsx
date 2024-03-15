"use client"
import React from "react"
import { Form, Input, Button, notification } from "antd"
import "./index.css"
import url from "@/apis/url"
import { useRouter } from "next/navigation"

const LoginForm = () => {
	const router = useRouter()
	const onFinish = async (
		values: Record<"username" | "password", string>
	) => {
		// 这里可以添加你的登录逻辑，例如向后端发送请求验证用户名和密码
		const { username, password } = values

		const myHeaders = new Headers()
		myHeaders.append("Content-Type", "application/json")
		const body = JSON.stringify({
			username,
			password
		})

		await fetch(url.LOGIN, {
			method: "POST",
			body,
			headers: myHeaders
		})
			.then((res: any) => res.json())
			.then((res) => {
				if (res.code === 200) {
					const token = res.data.access_token
					if (token) {
						localStorage.setItem("wm-token", token)
						notification.success({
							message: "登录成功"
						})
						router.push("/")
					}
				} else {
					notification.error({
						message: `${res.message}`
					})
				}
			})
	}

	return (
		<div className="login_container">
			<div className="login_container__wrapper">
				<div className="login_container__form-title">登录</div>
				<Form
					onFinish={onFinish}
					className="login_container__form"
					name="login-form"
					initialValues={{ remember: true }}
				>
					<Form.Item
						name="username"
						rules={[
							{
								required: true,
								message: "请输入用户名!"
							}
						]}
					>
						<Input placeholder="用户名" />
					</Form.Item>

					<Form.Item
						name="password"
						rules={[
							{
								required: true,
								message: "请输入密码!"
							}
						]}
						hasFeedback
					>
						<Input.Password placeholder="密码" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							登录
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	)
}

export default LoginForm
