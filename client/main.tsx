import React from "react";
import { createRoot } from "react-dom/client";
import "./global.css";

import { App } from "./App";
import { checkBackendHealth } from "./lib/api";

// Run health check on app startup
checkBackendHealth().then((isHealthy) => {
  if (!isHealthy) {
    console.warn('⚠️  Backend health check failed - some features may not work correctly');
  }
});

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
