require "assert"

require "./utils"
require "./minifiers"
require "./compiler"
require "./devserver"
require "file_utils"

module Conduit
  VERSION = "0.1.0"

  class TemplateStorage
    extend BakedFileSystem
    bake_folder "../template"
  end

  def self.write_template_file(path, project_path)
    puts " + #{project_path}/#{path}".gsub("./", "")
    src = TemplateStorage.get(path).gets_to_end
    File.write(path, src)
  end

  def self.argv_match?(sequence : Array(String))
    return false unless ARGV.size >= sequence.size
    sequence.each_with_index do |item, i|
      return false unless ARGV[i] == item
    end
    return true
  end

  def self.create_dir(path)
    puts " + #{path.gsub("./", "")}"
    FileUtils.mkdir_p(path)
    raise "directory was not created" unless File.exists?(path)
  end

  def self.create_file(path)
    puts " + #{path.gsub("./", "")}"
    FileUtils.touch(path)
    raise "file was not created" unless File.exists?(path)
  end

  def self.init_project(project_path)
    puts ""
    puts "initializing project in '#{project_path}'"
    puts ""
    raise "specified project already exists in the current directory!" if File.exists?(project_path)
    create_dir(project_path)
    create_dir("#{project_path}/css")
    create_file("#{project_path}/css/.keep")
    create_dir("#{project_path}/js")
    create_dir("#{project_path}/public")
    create_file("#{project_path}/public/.keep")
    create_dir("#{project_path}/views")
    create_file("#{project_path}/views/.keep")
    FileUtils.cd(project_path)
    write_template_file("js/conduit.js", project_path)
    write_template_file("js/routes.js", project_path)
    write_template_file("views/router.html", project_path)
    puts ""
    puts `git init`
    puts ""
    puts "done."
    ensure_in_project_root_dir!
  end

  def self.check_prereqs
    if `which git` == ""
      puts "error: git must be installed to use conduit"
      puts "please install git and try again"
      exit 1
    end
    if `which tar` == ""
      puts "error: tar must be installed to use conduit"
      puts "please install tar and try again"
      exit 1
    end
    if `which s3cmd` == ""
      if `which python` == ""
        puts "error: python must be installed to use conduit"
        puts "please install python and try again"
        exit 1
      end
      if `which pip` == ""
        puts "error: python-pip must be installed to use conduit, or s3cmd must be installed manually"
        puts "please install pip or s3cmd and try again"
        exit 1
      end
      puts "error: s3cmd must be installed to use conduit"
      puts "please run 'pip install --user s3cmd' and close and re-open this terminal before continuing"
      exit 1
    end
    if !File.exists?("#{ENV["HOME"]}/.s3cfg")
      puts "error: s3cmd must be configured with usable credentials to use conduit"
      puts "please run 's3cmd --configure' and configure your credentials before trying again"
      exit 1
    end
  end

  def self.init_cli
    check_prereqs
    if argv_match?(["init"]) && ARGV.size == 2
      project_name = ARGV[1].underscore
      path = "./#{project_name}"
      init_project(path)
    elsif argv_match?(["start"]) && ARGV.size == 1
      start_server
    else
      puts ""
      puts "conduit v#{VERSION}"
      puts ""
      puts "usage:"
      puts ""
      puts "  conduit init [name]   (creates new project, creates directory called [name])"
      puts "  conduit start         (starts dev server, must run from root of project)"
      puts "  conduit upgrade       (upgrades existing app, must run from root of project)"
      puts "  conduit update        (checks for and installs latest conduit binary)"
      puts "  conduit help          (displays this info)"
      puts ""
    end
  end
end

Conduit.init_cli
