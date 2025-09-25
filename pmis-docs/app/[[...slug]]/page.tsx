import React from 'react'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { notFound } from 'next/navigation'

type PageProps = {
    params: Promise<{ slug?: string[] }>
}

export const generateStaticParams = generateStaticParamsFor('slug')
export const dynamicParams = false

export default async function NextraContentPage({ params }: PageProps) {
    const resolvedParams = await params
    const slug = resolvedParams?.slug ?? []
    if (slug.length === 1 && slug[0] === 'favicon.ico') {
        notFound()
    }
    const { default: MDXContent, toc, metadata } = await importPage(slug)
    const components = getMDXComponents({})
    const Wrapper = (components as any).wrapper
    if (Wrapper) {
        return (
            <Wrapper toc={toc} metadata={metadata}>
                <MDXContent params={resolvedParams} />
            </Wrapper>
        )
    }
    return <MDXContent params={resolvedParams} />
}