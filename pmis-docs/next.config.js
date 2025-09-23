import nextra from 'nextra'
import { remarkMermaid } from '@theguild/remark-mermaid'

const withNextra = nextra({})

export default withNextra({
    output: 'export',
    images: {
        unoptimized: true
    },
    mdxOptions: {
        remarkPlugins: [remarkMermaid],
    }
});