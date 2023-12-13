interface IProps {
  children: React.ReactNode;
}

export default function Home(props: IProps) {
  const { children } = props;
  return <div>213123{children}</div>;
}
