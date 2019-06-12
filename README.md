# Conduit
A batteries-included frontend (vanilla) javascript framework with client-side routing for
creating cloud storage hosted, static bundles that interact with an external API server.
Conduit is designed to be the ultimate frontend framework for serverless web apps and SPAs
(Single Page Apps).

## Intended Audience
Conduit is designed for developers:
* who want a no-nonsense frontend framework that is fast, short, simple, and isn't reactjs/vuejs/etc
* that don't want to have to use newer javascript dialects or an entire Node.js ecosystem just to write browser javascript
* that want SPAs that can be hosted in cloud storage but can still be indexed by search engines
* that want instant page loads
* who like the idea of sane, opinionated defaults, and convention over configuration
* who believe in the value of pre-compiled views/templates
* that are _so done_ with server side rendering, wrangling web servers and 20 minute docker deploys
* that need a scalable frontend for their serverless web app / API

## Features
* cross-platform `conduit` binary that comes with all the functionality you need to create, test, and deploy your app
* built-in client-side routing system that is Googlebot and S3/Cloudfront friendly
* all views are compiled and compressed into an auto-generated index.html file managed by the routing engine
* instantaneous page loads, since all views are pre-compiled and included in the initial index.html bundle
* all local page loads are intercepted and serviced by the routing engine (in a way similar to turbolinks and reactjs/vuejs)
* easy setup -- just need a Cloudfront-enabled S3 bucket with 404 handling set to always load index.html
* no clunky Node.js/webpack ecosystem required -- all you need is the `conduit` binary
* uses HTML 5 browser history API to rewrite URLs on the fly and ensure the back button still works
* development server (run using `conduit start`) supports hot re-loading of project files as they are changed
* compatible with any cloud storage service that can have all paths automatically load index.html
* forces you to use one unified set of`<head>` contents for your entire application, simplifying asset management and improving page load times

## Installation
Pre-compiled static binaries are provided for linux and macos. You can use our install script, as shown below,
to install conduit with a single command, to your home directory without requiring root access. You can also
browse the releases page and manually download a binary and it to your system PATH.

Run this in a terminal:
```
curl -o- https://raw.githubusercontent.com/sam0x17/conduit/master/install.sh | bash
```
Then just log out and log back in, and `conduit` should be available as a command from all your terminals.
To upgrade just follow the same steps as above and the old version will be overwritten by the new version.

## Short-Term TODO
- [x] initial binary release
- [x] installation script
- [ ] installation instructions
- [ ] usage instructions
- [ ] example app
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
