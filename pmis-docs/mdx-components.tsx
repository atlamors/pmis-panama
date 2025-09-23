import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import { Callout, Cards, Steps, Tabs } from 'nextra/components'
import ScalarApiReference from './components/ScalarApiReference'
import DocCard from './components/DocCard'

const themeComponents = getThemeComponents()

export function useMDXComponents(components?: any) {
  return {
    ...themeComponents,
    // Nextra content components used in our MDX
    Cards,
    Callout,
    Card: DocCard,
    Steps,
    Tabs,
    Tab: (Tabs as any).Tab,
    // Custom components
    ScalarApiReference,
    ...(components || {})
  }
}