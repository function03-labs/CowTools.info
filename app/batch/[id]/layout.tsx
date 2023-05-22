
import { Metadata } from 'next';


export async function generateMetadata(
  { params, searchParams }: any,
): Promise<Metadata> {
  return {
    title: `Batch ${params.id} | CowTools`,
    description: `Batch ${params.id} | CowTools`,
  }
}

export default function BatchLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>

      {children}

    </>
  )
}