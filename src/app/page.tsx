import theme from "@/theme/themeConfig";
import { Button, ConfigProvider } from "antd";

export default function Home() {
  return (
    <div>
      <ConfigProvider theme={theme}>
        <Button />
        123
      </ConfigProvider>
    </div>
  );
}
