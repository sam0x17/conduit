# conduit
An all-batteries-included vanilla js frontend framework with client-side routing for
creating edge-hosted static bundles that interact with an external API server.

## Planned Features
* Googlebot-friendly built-in client-side routing
* easy setup -- just need a Cloudfront-enabled S3 bucket with 404 handling set to load index.html
* no external dependencies, no Node.js, no JQuery (minification libraries packaged as precompiled binaries)
* uses intelligent diffing system for DOM updating, inspired by React and Turbolinks
* all page loads are intercepted and loaded as AJAX requests -- only changed areas of the DOM are updated
* cross-platform crystal-based testing server, deployment manager, and project creation tool
