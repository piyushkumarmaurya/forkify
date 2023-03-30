import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //Get id from address bar hash
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //Update results view to mark the selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //Load Recipe
    await model.loadRecipe(id);

    //Render Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
//For directly loading id from address bar
controlRecipes();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //Get query
    const query = searchView.getQuery();
    if (!query) return;

    //Get results
    await model.loadSearchResults(query);

    //Render results
    resultsView.render(model.getSearchResultsPage());

    //Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err.message);
  }
};
//controlSearchResults();

const controlPagination = function (goToPage) {
  //Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe in state
  model.updateServings(newServings);

  //re render recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add Remove Toggle
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);

  //Update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //spinner
    addRecipeView.renderSpinner();

    //upload new recipe
    await model.uploadRecipe(newRecipe);

    //render after uploading
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //bookmark re render
    bookmarksView.render(model.state.bookmarks);

    //update the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (e) {
    addRecipeView.renderError(e.message);
  }
};

const clearBookmarks = function () {
  const el = document.querySelector('.header__logo');
  el.addEventListener('click', function (e) {
    model.clearBookmarks();
  });
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  clearBookmarks();
};

init();
