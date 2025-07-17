import { Html, Head, Main, NextScript } from 'next/document'
import { ColorSchemeScript } from '@mantine/core'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script defer src="https://pv.undefined.today/tracker.min.js" data-website-id="BlogStatus-tracker"></script>
      </body>
    </Html>
  )
}
