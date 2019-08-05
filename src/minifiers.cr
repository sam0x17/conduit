require "baked_file_system"
require "file_utils"

module Conduit::Minifiers
  PKG_DIR = "/tmp/conduit-minifiers"
  CLEAN_CSS_PATH = "#{PKG_DIR}/packages/clean-css"
  HTML_MINIFIER_PATH = "#{PKG_DIR}/packages/html-minifier"
  UGLIFY_PATH = "#{PKG_DIR}/packages/uglify-js"
  HTML_MINIFIER_OPTIONS = "--case-sensitive --conservative-collapse --minify-css=true --minify-js=true --use-short-doctype --remove-tag-whitespace --remove-script-type-attributes --remove-comments --minify-css --minify-js --collapse-whitespace --collapse-inline-tag-whitespace"
  CLEAN_CSS_OPTIONS = "--skip-rebase"

  class MinifierStorage
    extend BakedFileSystem
    bake_folder "../bin/packages"
  end

  def self.initialize
    if !File.exists?(PKG_DIR) || Time.now - File.info(PKG_DIR).modification_time > 1.week
      puts " > updating minifier binaries"
      FileUtils.mkdir_p(PKG_DIR)
      FileUtils.rm_rf("#{PKG_DIR}/*")
      File.write(PKG_DIR + "/packages.tar.gz", MinifierStorage.get("packages.tar.gz").gets_to_end)
      `tar -xzvf #{PKG_DIR}/packages.tar.gz -C #{PKG_DIR}`
      FileUtils.rm_rf("#{PKG_DIR}/packages.tar.gz")
    end
    assert File.exists?(CLEAN_CSS_PATH)
    assert File.exists?(HTML_MINIFIER_PATH)
    assert File.exists?(UGLIFY_PATH)
  end

  def self.minify_css(path)
    `#{CLEAN_CSS_PATH} #{CLEAN_CSS_OPTIONS} "#{path}"`
  end

  def self.minify_html(path)
    `#{HTML_MINIFIER_PATH} #{HTML_MINIFIER_OPTIONS} "#{path}"`
  end

  def self.minify_js(path)
    `#{UGLIFY_PATH} "#{path}"`
  end
end

def minify_js(path)
  Conduit::Minifiers.minify_js(path)
end

def minify_css(path)
  Conduit::Minifiers.minify_css(path)
end

def minify_html(path)
  Conduit::Minifiers.minify_html(path)
end

Conduit::Minifiers.initialize
