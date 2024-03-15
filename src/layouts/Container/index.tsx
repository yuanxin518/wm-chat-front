"use client"
import React, { ReactNode } from "react"
import "./index.scss"

interface IProps {
	children: ReactNode
}

const Container: React.FC<IProps> = (props) => {
	const { children } = props

	return (
		<div className="container">
			<div className="container-left">left</div>
			<div className="container-right">{children}</div>
		</div>
	)
}

export default Container
