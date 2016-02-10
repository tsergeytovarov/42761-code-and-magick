'use strict';

(function() {
  var reviewsFilter = document.querySelector('.reviews-filter');
  reviewsFilter.classList.add('invisible');

  var reviewsWrapper = document.querySelector('.reviews');
  var reviewsContainer = document.querySelector('.reviews-list');

  var loadedReviews,
    currentLoadedReviews;

  var STEP_ITEM = 3;
  var currentStep = 0;
  var reviewsMore = document.querySelector('.reviews-controls-more');

  getReviews();

  reviewsFilter.addEventListener('change', function(evt) {

    var cloneLoadedReviews = loadedReviews.slice(0);

    switch (evt.target.value) {
      case 'reviews-all':
        drawReviews(cloneLoadedReviews, true);
        currentLoadedReviews = cloneLoadedReviews;
        break;
      case 'reviews-recent':
        cloneLoadedReviews.sort(function(a, b) {
          return b.date - a.date;
        });
        var filterNewList = cloneLoadedReviews.filter(function(reviewDate) {
          // делаем выборку за последние 14 дней
          var lastTwoWeeks = Date.now() - 14 * 24 * 60 * 60 * 1000;
          var reviewDateMs = new Date(reviewDate.date);
          return +reviewDateMs > lastTwoWeeks;
        });
        drawReviews(filterNewList, true);
        currentLoadedReviews = filterNewList;
        break;
      case 'reviews-good':
        cloneLoadedReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        var filterRateUpList = cloneLoadedReviews.filter(function(reviewRate) {
          return reviewRate.rating > 2;
        });
        drawReviews(filterRateUpList, true);
        currentLoadedReviews = filterRateUpList;
        break;
      case 'reviews-bad':
        cloneLoadedReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        var filterRateDownList = cloneLoadedReviews.filter(function(reviewRate) {
          return reviewRate.rating < 3;
        });
        drawReviews(filterRateDownList, true);
        currentLoadedReviews = filterRateDownList;
        break;
      case 'reviews-popular':
        cloneLoadedReviews.sort(function(a, b) {
          return a.review_usefulness - b.review_usefulness;
        });
        drawReviews(cloneLoadedReviews, true);
        currentLoadedReviews = cloneLoadedReviews;
        break;
    }
  });

  /**
   * Функция превращающая данные в шаблон
   * @param {Object} data
   * @return {Element}
   */
  function getReviewTemplate(data) {
    var reviewElement = cloneReviewTemplate();

    var reviewText = reviewElement.querySelector('.review-text');

    var reviewRating = reviewElement.querySelector('.review-rating');
    var ratingArray = ['', 'two', 'three', 'four', 'five'];
    if (data.rating !== 1) {
      reviewRating.classList.add('review-rating-' + ratingArray[data.rating - 1]);
    }

    reviewText.textContent = data.description;

    var reviewImage = new Image(124, 124);
    reviewImage.src = data.author.picture;
    reviewImage.alt = data.author.name;

    var reviewImageLoadTimeout;

    reviewImage.onload = function() {
      clearTimeout(reviewImageLoadTimeout);
      var templateImage = reviewElement.querySelector('.review-author');
      var imageClass = templateImage.classList;
      reviewImage.classList.add(imageClass);
      reviewElement.replaceChild(reviewImage, templateImage);
    };

    reviewImage.onerror = function() {
      reviewElement.classList.add('review-load-failure');
    };

    var REVIEW_IMAGE_TIMEOUT = 5000;

    reviewImageLoadTimeout = setTimeout(function() {
      reviewImage.src = '';
      reviewElement.classList.add('review-load-failure');
    }, REVIEW_IMAGE_TIMEOUT);

    return reviewElement;
  }

  /**
   * Функция забирающая шаблон из HTML
   * @return {Element}
   */
  function cloneReviewTemplate() {
    var reviewTemplate = document.querySelector('#review-template');

    /* for IE */
    if ('content' in reviewTemplate) {
      return reviewTemplate.content.querySelector('.review').cloneNode(true);
    } else {
      return reviewTemplate.children[0].cloneNode(true);
    }
  }

  /**
   * Функция рисующая отзывы из данных
   * @param {Array.<Object>} data
   * @param {boolean} clear
   */
  function drawReviews(data, clear) {
    if (clear) {
      reviewsContainer.innerHTML = '';
      currentStep = 0;
    }
    var dataLenght = data.length;
    var sliceStart = currentStep * STEP_ITEM;
    var sliceEnd = sliceStart + STEP_ITEM;
    data = data.slice(sliceStart, sliceEnd);
    data.forEach(function(item) {
      var review = getReviewTemplate(item);
      reviewsContainer.appendChild(review);
    });
    if (sliceEnd < dataLenght) {
      reviewsMore.classList.remove('invisible');
      currentStep++;
    } else {
      reviewsMore.classList.add('invisible');
    }
  }

  /**
   * Функция забирающая данные через ajax с сервера
   */
  function getReviews() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/reviews.json');
    xhr.timeout = 10000;

    // событие по началу загрузки
    xhr.onloadstart = function() {
      reviewsWrapper.classList.add('reviews-list-loading');
    };

    // событие если ошибка
    xhr.onerror = function() {
      reviewsWrapper.classList.add('reviews-load-failure');
    };

    // событие по тайауту
    xhr.ontimeout = function() {
      reviewsWrapper.classList.add('reviews-load-failure');
    };

    // событие по загрузке
    xhr.onload = function(evt) {
      reviewsWrapper.classList.remove('reviews-list-loading');
      reviewsFilter.classList.remove('invisible');
      var loadedData = evt.target.response;
      loadedReviews = JSON.parse(loadedData);

      drawReviews(loadedReviews, true);
      currentLoadedReviews = loadedReviews;

      reviewsMore.addEventListener('click', function(event) {
        event.preventDefault();
        drawReviews(currentLoadedReviews, false);
      });
    };

    xhr.send();
  }
})();
