import ClientLayout from '../client-layout'
import {Suspense} from 'react'

export default function SuccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ClientLayout>
        <Suspense>

        {children}

        </Suspense>
        </ClientLayout>
    </>
  )
}
