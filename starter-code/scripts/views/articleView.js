'use strict';

(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo =
      parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus =
      article.publishedOn ? 'published ' +
      article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This is an event handler for the filters. First they need to be populated,
  //and then they need to be handled.
  //This funciton is called on the articleView object. First it loads in
  //options and then renders the handlebars template which compiles the data
  //into the template that is defined in the head of the html document.
  //Then it takes this information and passes the jquery function to turn this to text,
  //then the options variable is populated with the article object calling all Authors on it,
  //this way all of the author information can populate.
  //lastly, the map function is called as a method on this with the author passed as an
  //argument to return the template handlebars object with the value and author.
  //this final step helps cement the transmission of information to create the template.
  //All that needs to happen now, is to have this called.
  articleView.populateFilters = function() {
    var options;
    var template = Handlebars.compile($('#option-template').text());
    options = Article.allAuthors()
      .map(function(author) {
        return template({val: author});
      });
    $('#author-filter').append(options);

    Article.allCategories(function(rows) {
      $('#category-filter').append(
        rows.map(function(row) {
          return template({val: row.category});
        })
      );
    });
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This function handles the filters after they have populated and been clicked on.
  //It does this by grabbing the filters id from the html, invoking the jquery one method on it.
  //In the jquery API docs it states: 'Attach a handler to an event for the elements. The handler is executed at most once per element per event type.'
  //Thus this is handling the events 'change' and 'select'- which triggers a function
  // that allows for the filter to work by traversing the dom through a stored variable
  // called resource that is later used in the execution path for the page function to
  //help navigate between these different data points and not refresh the page.
  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      var resource = this.id.replace('-filter', '');
      $(this).parent().siblings().children().val('');
      page('/' + resource + '/' +
      // Replace any/all whitespace with a '+' sign
        $(this).val().replace(/\W+/g, '+')
      );
    });
  };
/* articleView.handleAuthorFilter = function() {
     $('#author-filter').on('change', function() {
       if ($(this).val()) {
         $('article').hide();
         $('article[data-author="' + $(this).val() + '"]').fadeIn();
       } else {
         $('article').fadeIn();
         $('article.template').hide();
       }
       $('#category-filter').val('');
     });
   };

   articleView.handleCategoryFilter = function() {
     $('#category-filter').on('change', function() {
       if ($(this).val()) {
         $('article').hide();
         $('article[data-category="' + $(this).val() + '"]').fadeIn();
       } else {
         $('article').fadeIn();
`        $('article.template').hide();
        }
       $('#author-filter').val('');
     });
   };

   DONE: Remove the setTeasers method,
    and replace with a plain ole link in the article template.
   articleView.setTeasers = function() {
     $('.article-body *:nth-of-type(n+2)').hide();

     $('#articles').on('click', 'a.read-on', function(e) {
       e.preventDefault();
       $(this).parent().find('*').fadeIn();
       $(this).hide();
     });
   }; */

  // COMMENT: What does this method do?  What is it's execution path?
  //These are the event handlers for what happens when the filters are used.
  //First they need to be populated, this is acheived by
  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();

    $('#articles article').remove();
    articles.forEach(function(a) {
      $('#articles').append(render(a));
    });

    articleView.populateFilters();
    articleView.handleFilters();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  module.articleView = articleView;
})(window);
