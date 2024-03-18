"use client"
import url from "@/apis/url"
import { notification } from "antd"
import { useEffect, useState } from "react"
import ReactWordCloud, { Word } from "react-wordcloud"
const WordComponent = () => {
	const [words, setWords] = useState<Word[]>([])
	useEffect(() => {
		const myHeaders = new Headers()
		myHeaders.append("Content-Type", "application/json")
		myHeaders.append(
			"wm-chat-token",
			localStorage.getItem("wm-token") || ""
		)

		const body = JSON.stringify({})

		fetch(url.WORD, {
			method: "POST",
			body,
			headers: myHeaders
		})
			.then((res: any) => res.json())
			.then((res) => {
				console.log(res.data)
				if (res.data.success) {
					setWords([
						...((res.data.data as any).map(
							(item: string, index: number) => ({
								text: item,
								value: index
							})
						) as any)
					])
				} else {
					notification.error({
						message: "获取失败"
					})
					return
				}
			})
	}, [])
	return <ReactWordCloud words={words} />
}

export default WordComponent
