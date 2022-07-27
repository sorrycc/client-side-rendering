module.exports = pages => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="theme-color" content="#1e90ff">
      <meta name="description" content="A demonstration of CSR">
      <meta property="og:title" content="">
      <meta property="og:type" content="website">
      <meta property="og:url" content="">
      <meta property="og:image" content="https://client-side-rendering.pages.dev/icons/og-icon.png">

      <link rel="shortcut icon" href="/icons/favicon.ico">
      <link rel="manifest" href="/manifest.json">
      <link rel="preload" href="https://fonts.gstatic.com/s/montserrat/v21/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2" as="font" type="font/woff2" crossorigin>

      <title>Client-side Rendering</title>

      <script>
        const isStructureEqual = (pathname, path) => {
          pathname = pathname.split('/')
          path = path.split('/')

          if (pathname.length !== path.length) return false

          return pathname.every((segment, ind) => segment === path[ind] || path[ind].includes(':'))
        }

        let { pathname } = window.location

        if (pathname !== '/') pathname = pathname.replace(/\\/$/, '')

        const pages = ${JSON.stringify(pages)}

        pages.forEach(({ path, scripts, data }) => {
          const match = pathname === path || (path.includes(':') && isStructureEqual(pathname, path))
      
          if (!match) return
          
          scripts.forEach(script => {
            document.head.appendChild(
              Object.assign(document.createElement('link'), { rel: 'preload', href: '/' + script, as: 'script' })
            )
          })

          if (!data) return
          
          data.forEach(({ url, dynamicPathIndex, crossorigin }) => {
            let fullURL = url
            
            if (dynamicPathIndex) {
              const [id] = pathname.split('/').slice(dynamicPathIndex, dynamicPathIndex + 1)

              if (!id) return
              
              fullURL = url.replace('?', id)
            }

            document.head.appendChild(
              Object.assign(document.createElement('link'), { rel: 'preload', href: fullURL, as: 'fetch', crossOrigin: crossorigin })
            )
          })
        })
      </script>
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>

      <div id="root"></div>
    </body>
  </html>
`
