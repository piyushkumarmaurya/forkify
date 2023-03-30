import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _previousPageButtonMarkup(curPage) {
    return `
      <button data-goto = "${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
      </button>
    `;
  }
  _nextPageButtonMarkup(curPage) {
    return `
      <button data-goto = "${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
    `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page1 and there are OTHER pages
    if (curPage === 1 && numPages > 1) {
      return this._nextPageButtonMarkup(curPage);
    }
    //Last Page
    if (curPage === numPages && numPages > 1) {
      return this._previousPageButtonMarkup(curPage);
    }
    //Other Page
    if (curPage < numPages) {
      return (
        this._previousPageButtonMarkup(curPage) +
        this._nextPageButtonMarkup(curPage)
      );
    }
    //Page1 and there are NO other pages
    return '';
  }
}

export default new PaginationView();
