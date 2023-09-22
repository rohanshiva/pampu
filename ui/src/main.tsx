import React from 'react'
import ReactDOM from 'react-dom/client'
import { toast } from "sonner";
import Page from './page.tsx'
import './index.css';
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    toast("✨ Fresh update available!", {
      action: {
        label: "Reload",
        onClick: () => {
          updateSW(true);
        }
      }
    })
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)
