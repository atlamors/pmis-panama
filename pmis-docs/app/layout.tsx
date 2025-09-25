import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
    // Define your metadata here
    // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

// const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>
const navbar = (
    <Navbar
        logo={
            <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', animation: 'fade-in 1s ease-in-out' }}>
                <span style={{ display: 'inline-block', fill: 'white' }}>
                    <svg style={{ width: '1.5rem', height: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 348 368">
                        <polygon
                            points="347 167 227.4 240 243 367 150.5 290 33 365.9 90 252 24.5 252 1 231 126 231 90 300 156.5 258.3 211 304 201.1 231.1 271 188 196 188 193 167 347 167" />
                        <path
                            d="M347,124l-34.6,21.9h-120.8c0,0-9.6-69.4-9.6-69.4l-2-1.5-35,71h-78l55.6,42-10.6,21.5H22.8S1,188,1,188h86L1,124h129.5L196,1l16,123.6c.7.6,1.3-.6,1.5-.6h133.5Z" />
                    </svg>
                </span>
                <h1 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    Canal PMIS Developer Docs
                </h1>
            </span>
        }
    // ... Your additional navbar options
    />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            // Not required, but good for SEO
            lang="en"
            // Required to be set
            dir="ltr"
            // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
            suppressHydrationWarning
        >
            <Head
            // ... Your additional head options
            >
                {/* Your additional tags should be passed as `children` of `<Head>` element */}
            </Head>
            <body>
                <Layout
                    //https://nextra.site/docs/guide/markdownbanner={banner}
                    navbar={navbar}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
                    footer={footer}
                //...
                >
                    {children}
                </Layout>
            </body>
        </html>
    )
}