declare module '*.svg' {
  // The SVG rollup plugin inlines the SVG as a simple string.
  const icon: string
  export = icon
}
