# Conduit
An all-batteries-included vanilla js frontend framework with client-side routing for
creating edge-hosted static bundles that interact with an external API server.

## Planned Features
* Googlebot-friendly built-in client-side routing
* easy setup -- just need a Cloudfront-enabled S3 bucket with 404 handling set to load index.html
* no external dependencies, no Node.js, no JQuery (minification libraries packaged as precompiled binaries)
* uses intelligent diffing system for DOM updating, inspired by React and Turbolinks
* all page loads are intercepted and loaded as AJAX requests -- only changed areas of the DOM are updated
* cross-platform crystal-based testing server, deployment manager, and project creation tool


# Working Notes:

## Features of fully scalable SPAs
1. assets (static/s3) + client-side business logic <-- this framework addresses this
2. business logic (API server or cloud functions) <-- left to the implementer
3. database (no db, or something horizontally scalable tidb/etc) <-- left to the implementer

## Requirements
1. minification -- bundle html-minifier (html, MIT), crass (css, MIT), uglify (js, BSD-2-Clause), via pkg

# Legal

## UglifyJS
Note that conduit packages a binary form of the [UglifyJS]()
NPM package. UglifyJS
is licensed under the BSD-2-Clause license, which requires that we include the
following legal info in our documentation in order to use UglifyJS:

```
UglifyJS is released under the BSD license:

Copyright 2012-2019 (c) Mihai Bazon <mihai.bazon@gmail.com>

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

    * Redistributions of source code must retain the above
      copyright notice, this list of conditions and the following
      disclaimer.

    * Redistributions in binary form must reproduce the above
      copyright notice, this list of conditions and the following
      disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.
```
## Crass
Note that conduit packages a binary form of the
[crass](https://www.npmjs.com/package/crass) NPM package. Crass
is licensed under the MIT license, which requires that we include the
following legal info in our application:

```
# The MIT License (MIT)

Copyright (c) 2015 Matt Basta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```