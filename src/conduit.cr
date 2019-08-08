require "assert"
require "tempdir"
require "file_utils"

require "./utils"
require "./minifiers"
require "./compiler"
require "./devserver"

module Conduit
  VERSION = "0.1.4"

  class TemplateStorage
    extend BakedFileSystem
    bake_folder "../template"
  end

  def self.write_template_file(path, project_path)
    src = TemplateStorage.get(path).gets_to_end
    path = path.gsub("gitignore", ".gitignore")
    puts " + #{project_path}/#{path}".gsub("./", "")
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

  def self.upgrade(project_path)
    puts ""
    puts "upgrading project in '#{project_path}'"
    puts ""
    ensure_in_project_root_dir!
    write_template_file("js/conduit.js", project_path)
    puts ""
    puts "project upgrade complete!"
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
    FileUtils.cd(project_path)
    write_template_file("js/conduit.js", project_path)
    write_template_file("js/routes.js", project_path)
    write_template_file("views/router.html", project_path)
    write_template_file("gitignore", project_path)
    puts ""
    puts `git init`
    puts ""
    puts "done."
    ensure_in_project_root_dir!
  end

  def self.read_string(prompt)
    loop do
      puts prompt
      val = gets
      next if val.nil?
      return val.not_nil!.strip if val.size > 0
    end
    ""
  end

  def self.yesno
    print "[y/n]: "
    val = gets
    return false if val.nil?
    return val.not_nil!.downcase == "y"
  end

  def self.deploy
    check_s3cmd!
    ensure_in_project_root_dir!
    pwd = `pwd`.strip
    cfg = Path["~/.s3cfg"].expand.to_s
    cfg = Path["./.s3cfg"].expand.to_s if File.exists?("./.s3cfg")
    if File.exists?("./.s3_bucket")
      s3_bucket = File.read("./.s3_bucket").strip
    else
      s3_bucket = read_string("provide the target S3 bucket or cloudfront domain name and press [ENTER]")
      puts "note: you can save the bucket name to a file named .s3_bucket to keep from having to enter this again"
    end
    puts ""
    puts "target s3 bucket or cloudfront domain: s3://#{s3_bucket}"
    puts "project to upload: #{pwd}"
    puts ""
    puts "proceed with deploy?"
    if yesno
      puts ""
      puts "compiling app..."
      puts ""
      TempDir.create("conduit-deploy") do |target_path|
        puts " > copying static assets..."
        FileUtils.cp_r("./public", "#{target_path}/public")
        target_path = "#{target_path}/public"
        File.delete("#{target_path}/.keep") if File.exists?("#{target_path}/.keep")
        puts " > minifying and copying js assets..."
        find_files("./js") do |path|
          minified = minify_js(path)
          path = path[5..]
          FileUtils.mkdir_p("#{target_path}/js/#{Path[path].parent}")
          File.write("#{target_path}/js/#{path}", minified)
        end
        puts " > minifying and copying css assets..."
        find_files("./css") do |path|
          minified = minify_css(path)
          path = path[6..]
          FileUtils.mkdir_p("#{target_path}/css/#{Path[path].parent}")
          File.write("#{target_path}/css/#{path}", minified)
        end
        puts " > compiling, minifying, and copying index.html..."
        index_html = compile_views
        File.write("#{target_path}/index.html", index_html)
        puts ""
        puts `tree #{target_path}`
        puts ""
        puts "deploying to s3://#{s3_bucket}..."
        puts ""
        cfg = cfg.gsub(" ", "\\ ")
        args = ["sync", "#{target_path}/", "s3://#{s3_bucket}/", "--acl-public", "--delete-removed", "--guess-mime-type", "--no-mime-magic", "--no-preserve", "--cf-invalidate", "--config=#{cfg}"]
        Process.run(`command -v s3cmd`.strip, args, nil, false, false, Process::Redirect::Close, Process::Redirect::Inherit, Process::Redirect::Inherit, nil)
      end
      puts ""
      if File.exists?("./.deploy_action")
        puts "running deploy action..."
        puts `./.deploy_action`
        puts ""
      end
      puts "done."
    else
      puts "aborted."
    end
  end

  def self.check_prereqs!
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
  end

  def self.check_s3cmd!
    if `s3cmd --version` == ""
      if `which python` == ""
        puts "error: python must be installed to use conduit for deploys"
        puts "please install python and try again"
        exit 1
      end
      if `which pip` == ""
        puts "error: python-pip must be installed or s3cmd must be installed manually to use conduit for deploys"
        puts "please install pip or manually install s3cmd and try again (you will need to re-open this terminal)"
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
    check_prereqs!
    if argv_match?(["init"]) && ARGV.size == 2
      project_name = ARGV[1].underscore
      path = "./#{project_name}"
      init_project(path)
    elsif argv_match?(["start"]) && ARGV.size == 1
      start_server
    elsif argv_match?(["deploy"]) && ARGV.size == 1
      deploy
    elsif argv_match?(["upgrade"]) && ARGV.size == 1
      upgrade(`pwd`.strip)
    elsif argv_match?(["update"]) && ARGV.size == 1
      puts "this command is not yet implemented, aborting."
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
