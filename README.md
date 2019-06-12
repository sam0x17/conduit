# Conduit

A batteries-included frontend (vanilla) javascript framework with client-side routing for
creating cloud storage hosted, static bundles that interact with an external API server.
Conduit is designed to be the ultimate frontend framework for serverless web apps and SPAs
(Single Page Apps).

## Features

* cross-platform `conduit` binary that comes with all the functionality you need to create, test, and deploy your app
* built-in client-side routing system that is Googlebot and S3/Cloudfront friendly
* all views are compiled and compressed into an auto-generated index.html file managed by the routing engine
* instantaneous page loads, since all views are pre-compiled and included in the initial index.html bundle
* all local page loads are intercepted and serviced by the routing engine (in a way similar to turbolinks and reactjs/vuejs)
* Javascript, CSS, and HTML assets are automatically minified at deployment time (without the need for webpacker or nodejs)
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

## Getting Started

### New Project Setup
1. Install conduit using the one liner in the installation section above
2. Install and configure [s3cmd](https://github.com/s3tools/s3cmd) if you wish to use conduit to perform deploys (this is optional)
3. Verify that conduit is installed properly by running `conduit help` (you should see usage information)
4. Create a new project by running `conduit init [project-name]`. A project template and git repo will be automatically initialized.
5. Populate the `HEAD` in `router.html` with any css, fonts, or header-loaded javascript tags you will require in your app.
6. Create some views in the `/views` directory. These should be static HTML files that do not contain `BODY`, `HEAD`, or `HTML` tags.
7. You can have "partial" views automatically included inside of other views, e.g. if you have navbar.html, you can automatically include
   its contents in other pages by using the string `{{navbar}}` and these will automatically be replaced with the navbar at compile time.
8. Add routing logic to the `/js/routes.js` file by following the instructions and examples provided at the top of the file.
9. You can test your application locally by running `conduit start` in the root of your project directory. A web server will
   automatically start running your applicaiton at `http://localhost:3000/`. The dev server fully
   simulates the production environment with the exception that minification is not performed to enable easier debugging.

### Deployment
To deploy, simply run `conduit deploy` at the root of your project directory. You will need to have an S3 bucket set up with CloudFront,
with the 404 handling feature on CloudFront set to always load `index.html` with a status of `200`. You will also need to install and
configure [s3cmd](https://github.com/s3tools/s3cmd), as this is used by conduit's deployment routine.

Once you are ready, simply run `conduit deploy` and conduit will collect any required information and then deploy your app. This includes
automatically running an invalidation on CloudFront so that CloudFront will reflect the newly upload S3 files immediately.

## Usage

You can enter `conduit help` at any time to see the below usage information:
```
conduit v0.1.0

usage:

  conduit init [name]   (creates new project, creates directory called [name])
  conduit start         (starts dev server, must run from root of project)
  conduit upgrade       (upgrades existing app, must run from root of project)
  conduit update        (checks for and installs latest conduit binary)
  conduit help          (displays this info)
```

## Short-Term TODO

- [x] initial binary release
- [x] installation script
- [x] installation instructions
- [x] usage instructions
- [ ] macos binary release
- [ ] example app
- [ ] `conduit update` command for updating to the latest conduit binary
- [ ] `conduit upgrade` command, once we have additions that require retroactive changes to conduit.js or the routing system
- [ ] compress index.html with zlib/gzip compression
- [ ] ability to produce a static application bundle without deploying to S3
- [ ] confirm which search engines support conduit-style routing (Googlebot we know for sure)
- [ ] assess browser compatibility (only firefox is actively checked at the moment)

## Future Work

* optional haml/scss/sass/slim support
* built-in MVC framework, perhaps, though maybe as a separate project
* testing / spec framework, probably using headless chromium
* windows support (once crystal for windows drops)

# Legal Info

Please see [legal.md](legal.md) and [LICENSE](LICENSE) for mandatory legal and copyright notices.
