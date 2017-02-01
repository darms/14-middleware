'use strict';

(function(module) {
  var articleController = {};

  Article.createTable();

  articleController.index = function(ctx, next) {
    if(ctx.articles.length) {
      articleView.index(ctx.articles);
    } else{
      page('/');
    }
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This is calling the loadById function on the aricleController object, this will invoke
  // a function on it to load the article data by it's Id, this also passes through the context
  //next arguments so that navigation is more seamless and the page won't reload each time
  //one may navigate through its contents.
  articleController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };
    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This function loadByAuthor allows for the data to be sorted by author and for the
  //history api function to pass the ctx, and next arguments making for more efficient
  //navigation through the pages content. This way one will not have to have the
  //page refresh each time.
  articleController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere(
      'author', ctx.params.authorName.replace('+', ' '), authorData
    );
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This method is calling the loadByCategory function onto the articleController
  // object- this allows for the loadByCategory function to be loaded and navigated
  //by
  articleController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This function loadAll is going to render and call all of the previous functions
  //including author, filter, and category, and render them on the page with
  // the history api, this is taking the context and next arguments so that it can navigate
  //between these different points without having to refresh the page
  articleController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.allArticles;
      next();
    };

    if (Article.allArticles.length) {
      ctx.articles = Article.allArticles;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };

  module.articleController = articleController;
})(window);
