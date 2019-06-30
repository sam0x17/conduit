
class String
  def gsub(other : Hash(String, String))
    ret = self.clone
    other.each do |other_k, other_v|
      ret = ret.gsub(other_k, other_v)
    end
    ret
  end
end

module Conduit
  def self.filter_macros(src, version)
    src = src.gsub("{{!current_year}}", Time.now.year.to_s)
    src = src.gsub("{{version}}", version.to_s)
  end

  def self.compile_views(test_mode=false)
    version = Random.new.next_int.abs.to_s
    require_directory! "./views"
    require_file! "./views/router.html"
    router_html = File.read("./views/router.html")
    view_replace_hash = Hash(String, String).new
    views = Hash(String, String).new
    view_names = Hash(String, String).new
    find_files("./views") do |path|
      next if path == "./views/router.html"
      name = path[8..]
      name = name[..(name.size - 6)] if name.ends_with?(".html")
      if test_mode
        view = File.read(path)
      else
        view = minify_html(path)
      end
      view_replace_hash["{{#{name}}}"] = view
      views[name] = view
    end
    2.times do
      view_replace_hash.each do |name, contents|
        view_replace_hash[name] = contents.gsub(view_replace_hash)
      end
    end
    views.each do |name, contents|
      views[name] = contents.gsub(view_replace_hash)
    end
    views_str = "{\n"
    views.each do |name, contents|
      contents = filter_macros(contents, version)
      contents = Base64.strict_encode(contents)
      views_str += "\"#{name}\":\"#{contents}\",\n"
    end
    views_str = views_str[..(views_str.size - 3)] + "\n}"
    router_html = filter_macros(router_html, version)
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
