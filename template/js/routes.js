// add your routes here
// syntax: conduit.route(url_format, view_path, page_title, condition (optional function returning a boolean));
// routes should be listed in order of decreasing precedence
//
// e.g.:
//
// conduit.route('/widgets/:id/show', 'widgets', 'A Widget');
// conduit.route('/users/:id/edit', 'some/path/users', 'A User');
//
// conduit.route('/blogs/#article_name', 'blog/article', 'Blog Article', function(parts) {
//   console.log('article name: ', parts.article_name);
//   return urlVariables.startsWith('Tutorial: ');
// });
//
