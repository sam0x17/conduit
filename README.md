# Conduit
A batteries-included frontend (vanilla) javascript framework with client-side routing for
creating cloud storage hosted, static bundles that interact with an external API server.
Conduit is designed to be the ultimate frontend framework for serverless web apps and SPAs.

## Intended Audience
Conduit is designed for developers who:
* want a no-nonsense frontend framework that is fast, short, simple, and that isn't reactjs/vuejs/etc
* don't want to have to use newer javascript dialects or an entire Node.js ecosystem just to write browser javascript
* want SPAs that can be hosted in cloud storage but can still be indexed by search engines
* want instant page loads
* like the idea of sane, opinionated defaults, and convention over configuration
* believe in the value of pre-compiled views/templates
* are _so done_ with server side rendering, wrangling web servers and 20 minute docker deploys
* need a scalable frontend for their serverless web app / API

## Features
* cross-platform `conduit` binary that comes with all the functionality you need to create, test, and deploy your app
* built-in client-side routing system that is Googlebot and S3/Cloudfront friendly
* all views are compiled and compressed into an auto-generated index.html file managed by the routing engine
* instantaneous page loads, since all views are pre-compiled and included in the initial index.html bundle
* all local page loads are intercepted and serviced by the routing engine (in a way similar to turbolinks and reactjs/vuejs)
* easy setup -- just need a Cloudfront-enabled S3 bucket with 404 handling set to always load index.html
* no clunky Node.js/webpack ecosystem required -- all you need is the `conduit` binary
* development server (run using `conduit start`) supports hot re-loading of project files as they are changed
* compatible with any cloud storage service that can have all paths automatically load index.html
* forces you to use one unified set of`<head>` contents for your entire application, simplifying asset management and improving page load times

## Short-Term TODO
- [ ] initial binary release
- [ ] installation instructions
- [ ] usage instructions
- [ ] `conduit update` command for updating to the latest conduit binary
- [ ] `conduit upgrade` command, once we have additions that require retroactive changes to conduit.js or the routing system
- [ ] compress index.html with zlib/gzip compression
- [ ] ability to produce a static application bundle without deploying to S3
- [ ] confirm which search engines support conduit-style routing (Googlebot we know for sure)
- [ ] assess browser compatibility (only firefox is actively checked at the moment)
- [ ] macos binaries

## Future Work
* optional haml/scss/sass/slim support
* built-in MVC framework, perhaps, though maybe as a separate project
* testing / spec framework, probably using headless chromium
* windows support (once crystal for windows drops)

# Legal Info

Please see [legal.md](legal.md) and [LICENSE](LICENSE) for mandatory legal and copyright notices.
