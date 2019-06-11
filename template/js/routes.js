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
// you can also provide a function for the 'target' attribute that will return the target HTML page
// based on whatever circumstances you want to take into account (must be instantaneous, though, so
// you can't use asynchronous AJAX here) e.g.:
//
// function loginProtected(page) {
//   return function() {
//     if(isLoggedIn()) return page;
//     return 'login';
//   }
// }
// 
// conduit.route('/', loginProtected('dashboard'));
//
// this will render login.html if no user is logged in, and will otherwise render dashboard.html
