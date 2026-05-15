/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_ID?: string
  readonly VITE_CLARITY_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
