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
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <!--Start of Tawk.to Script-->
            <script type="text/javascript">
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/67f8f5e03bd7fb19144e619e/1ioi80tgr';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            </script>
            <!--End of Tawk.to Script-->
          `
        }}
      />
    </body>
  )
}
