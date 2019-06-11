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
//   return parts.article_name.startsWith('Tutorial: ') && getCookie('some_key') == 'some_value';
// });
//

conduit.route('/test-1', 'test', 'Test 1');
conduit.route('/test-2', 'test2', 'Test 2');
