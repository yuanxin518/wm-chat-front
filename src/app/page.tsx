import theme from "@/theme/themeConfig"
import { ConfigProvider } from "antd"

export default function Home() {
	return <ConfigProvider theme={theme}>home</ConfigProvider>
}
