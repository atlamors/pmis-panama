import React from 'react'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'

type PageProps = {
    params: { slug?: string[] }
}

export const generateStaticParams = generateStaticParamsFor('slug')

export default async function NextraContentPage({ params }: PageProps) {
    const slug = params.slug ?? []
    const { default: MDXContent, toc, metadata } = await importPage(slug)
    const components = getMDXComponents({})
    const Wrapper = (components as any).wrapper
    if (Wrapper) {
        return (
            <Wrapper toc={toc} metadata={metadata}>
                <MDXContent params={params} />
            </Wrapper>
        )
    }
    return <MDXContent params={params} />
}