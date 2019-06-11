module Conduit
  def self.require_file!(path)
    raise "must have a #{path} file defined" unless File.exists?(path)
  end
  
  def self.require_directory!(path)
    raise "must have a #{path} directory defined" unless File.exists?(path)
  end

  def self.ensure_in_project_root_dir!
    require_directory!("./views")
    require_directory!("./js")
    require_directory!("./css")
    require_directory!("./public")
    require_file!("./views/router.html")
    require_file!("./js/routes.js")
    require_file!("./js/conduit.js")
  end
end
