require "kemal"

def require_file!(path)
  raise "must have a #{path} file defined" unless File.exists?(path)
end

def require_directory!(path)
  raise "must have a #{path} directory defined" unless File.exists?(path)
end

def Kemal.display_startup_message(config, server)
  log "[#{config.env}] Conduit Development Server is live at http://localhost:3000"
end

module Conduit::DevServer
  def self.start
    require_directory! "./js"
    require_directory! "./public"
    require_directory! "./views"
    require_directory! "./css"
    require_file! "./views/router.html"
    require_file! "./js/conduit.js"
    require_file! "./js/routes.js"
    router_html = Conduit.compile_views
    get("/") { router_html }
    get("/*") do |context|
      path = "." + context.request.path
      if File.exists?(path)
        send_file context, path
      #elsif Path[path.to_s].extension.size > 0
      #  halt context, status_code: 404, response: "Not Found"
      else
        router_html
      end
    end
    Kemal.run
  rescue ex
    puts ""
    puts "error: #{ex.message}"
  end
end
