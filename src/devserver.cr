require "kemal"

def Kemal.display_startup_message(config, server)
  log "[#{config.env}] Conduit Development Server is live at http://localhost:3000"
end

module Conduit
  def self.start_server
    ensure_in_project_root_dir!
    get("/") { compile_views(true) }
    get("/*") do |context|
      path = "." + context.request.path
      if File.exists?(path)
        send_file context, path
      #elsif Path[path.to_s].extension.size > 0
      #  halt context, status_code: 404, response: "Not Found"
      else
        compile_views(true)
      end
    end
    Kemal.run
  rescue ex
    puts ""
    puts "error: #{ex.message}"
  end
end
