require "baked_file_system"

module Conduit::Minifiers
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
end
