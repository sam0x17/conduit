require "assert"
require "./minifiers"
require "./compiler"
require "./devserver"

module Conduit
end

#Conduit.compile_views
Conduit::DevServer.start
