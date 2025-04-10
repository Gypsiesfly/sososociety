"use client"

import { useEffect } from 'react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Remove Grammarly attributes on mount
  useEffect(() => {
    const body = document.querySelector('body')
    if (body) {
      body.removeAttribute('data-new-gr-c-s-check-loaded')
      body.removeAttribute('data-gr-ext-installed')
    }
  }, [])

  return (
    <body suppressHydrationWarning={true}>
      {children}
    </body>
  )
}
