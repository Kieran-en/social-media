import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

function init(){
    Sentry.init({
        dsn: "https://4fb9c016620e4373ab616ee2df132b10@o1365607.ingest.sentry.io/4504739536175104",
        //integrations: [new BrowserTracing()],
        integrations: [new Sentry.Integrations.Breadcrumbs({ console: false })],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
      });
}

export default{
    init
}