import Providers from "./providers/provider"

interface RootLayoutProps {
  children: React.ReactNode
  modal: React.ReactNode
}
export default function Layout(props: RootLayoutProps) {
  return (
    <>
      <Providers>
        {props.children}
        {props.modal}
      </Providers>
    </>
  )
}
