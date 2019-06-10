require "assert"
require "./minifiers"
require "./devserver"

module Conduit
  def self.compile_views(test_mode=false)
    version = Random.new.next_int.abs.to_s
    require_directory! "./views"
    require_file! "./views/router.html"
    router_html = File.read("./views/router.html")
    views_str = "{\n"
    find_files("./views") do |path|
      next if path == "./views/router.html"
      if test_mode
        view = File.read(path)
      else
        view = minify_html(path)
      view = view.gsub("\"", "\\\"").gsub("\n", "\\n")
      path = path[8..]
      path = path[..(path.size - 6)] if path.ends_with?(".html")
      views_str += "\"#{path}\":\"#{view}\",\n"
    end
    views_str = views_str[..(views_str.size - 3)] + "\n}"
    router_html = router_html.gsub("{{version}}", version)
    router_html.gsub("'{{views}}'", views_str)
  end

  private def self.find_files(path, &block : String ->)
    if File.file?(path)
      block.call(path)
    elsif File.directory?(path)
      Dir.each_child(path) do |child|
        next if child.starts_with?(".")
        find_files File.join(path, child), &block
      end
    end
  end
end

#Conduit.compile_views
Conduit::DevServer.start
