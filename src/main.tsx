import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

import { Provider } from "./components/ui/provider.tsx"
import { SnippetProvider } from './logic/snippetLogic.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <SnippetProvider>
        <App />
      </SnippetProvider>
    </Provider>
  </StrictMode>,
) 