require "baked_file_system"
require "file_utils"

module Conduit::Minifiers
  PKG_DIR = "/tmp/conduit-minifiers"
  {% if flag?(:linux) %}
    PLATFORM = "linux"
  {% elsif flag?(:darwin) %}
    PLATFORM = "macos"
  {% end %}
  CLEAN_CSS_PATH = "#{PKG_DIR}/#{PLATFORM}-packages/clean-css-#{PLATFORM}"
  HTML_MINIFIER_PATH = "#{PKG_DIR}/#{PLATFORM}-packages/html-minifier-#{PLATFORM}"
  UGLIFY_PATH = "#{PKG_DIR}/#{PLATFORM}-packages/uglify-js-#{PLATFORM}"

  class MinifierStorage
    extend BakedFileSystem
    {% if flag?(:linux) %}
      bake_folder "../bin/linux-packages"
    {% elsif flag?(:darwin) %}
      bake_folder "../bin/macos-packages"
    {% else %}
      raise 'unsupported platform'
    {% end %}
  end

  def self.initialize
    if !File.exists?(PKG_DIR) || Time.now - File.info(PKG_DIR).modification_time > 1.day
      FileUtils.mkdir_p(PKG_DIR)
      FileUtils.rm_rf("#{PKG_DIR}/*")
      File.write(PKG_DIR + "/packages.tar.gz", MinifierStorage.get("packages.tar.gz").gets_to_end)
      `tar -xzvf #{PKG_DIR}/packages.tar.gz -C #{PKG_DIR}`
      FileUtils.rm_rf("#{PKG_DIR}/packages.tar.gz")
      assert! File.exists?(CLEAN_CSS_PATH)
      assert! File.exists?(HTML_MINIFIER_PATH)
      assert! File.exists?(UGLIFY_PATH)
    end
  end
end

Conduit::Minifiers.initialize
puts "hello world"
