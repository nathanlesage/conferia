import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import svgLoader from 'vite-svg-loader'
import { markdownHintPlugin } from '@vuepress/plugin-markdown-hint'

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {
      // The SVGLoader "raw" import is necessary since this is how we configured
      // Conferia itself (the SVG will be set to the element's innerHTML). This
      // way we keep the docs compatible with our Rollup config.
      plugins: [svgLoader({ defaultImport: 'raw' })]
    }
  }),
  theme: defaultTheme({
    locales: {
      "/": {
        navbar: [
          {
            text: "User's Guide",
            link: "/users-guide/index.md",
            prefix: "/users-guide"
          },
          {
            text: "Organizer's Guide",
            link: "/organizers-guide/index.md",
            prefix: "/organizers-guide",
            children: [
              "getting-started.md",
              "configuration.md",
              "csv-format.md",
              "api.md"
            ]
          },
          { text: "Demo", link: "/demo/index.md" }
        ],
        sidebar: [
          {
            text: "User's Guide",
            collapsible: true,
            prefix: "/users-guide",
            link: "/users-guide/index.md",
            children: [
              "overview.md",
              "toolbar.md",
              "search.md",
              "agenda.md",
              "export-events.md",
              "workflow.md"
            ]
          },
          {
            text: "Organizer's Guide",
            collapsible: true,
            prefix: "/organizers-guide",
            link: "/organizers-guide/index.md",
            children: [
              "getting-started.md",
              "workflow.md",
              "configuration.md",
              "csv-format.md",
              "api.md"
            ]
          }
        ]
      }
    }
  }),
  locales: {
    "/": {
      lang: "en",
      title: "Conferia.js",
      description: "Visualize your conference schedule with ease"
    }
  },
  plugins: [
    markdownHintPlugin({ alert: true })
  ]
})
