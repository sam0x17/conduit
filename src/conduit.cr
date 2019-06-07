require "assert"
require "./minifiers"

module Conduit
end

puts minify_css("./bin/file.css")
puts minify_js("./bin/file.js")
puts minify_html("./bin/file.html")
