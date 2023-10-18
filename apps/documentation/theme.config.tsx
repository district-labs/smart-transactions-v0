import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  staticImage: true,
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  logo: <span>District Finance</span>,
  project: {
    link: 'https://github.com/district-labs/intentify',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/district-labs/intentify/app/docs',
  footer: {
    text: 'District Labs © 2023',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – District Finance',
    }
  }
}

export default config
