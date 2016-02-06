/* global reviews: true */
'use strict';

(function() {
  var reviewsFilter = document.querySelector('.reviews-filter');
  reviewsFilter.classList.add('invisible');

  var reviewsContainer = document.querySelector('.reviews-list');

  reviews.forEach(function(item) {
    var review = getReviewTemplate(item);
    reviewsContainer.appendChild(review);
  });

  reviewsFilter.classList.remove('invisible');

  /**
   * Функция превращающая данные в шаблон
   * @param {Object} data
   * @return {Element}
   */
  function getReviewTemplate(data) {
    var reviewElement = cloneReviewTemplate();

    var reviewText = reviewElement.querySelector('.review-text');

    var reviewRating = reviewElement.querySelector('.review-rating');
    var ratingClass;

    switch (data.rating) {
      case 1:
        break;
      case 2:
        ratingClass = 'review-rating-two';
        reviewRating.classList.add(ratingClass);
        break;
      case 3:
        ratingClass = 'review-rating-three';
        reviewRating.classList.add(ratingClass);
        break;
      case 4:
        ratingClass = 'review-rating-four';
        reviewRating.classList.add(ratingClass);
        break;
      case 5:
        ratingClass = 'review-rating-five';
        reviewRating.classList.add(ratingClass);
        break;
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
   * Функция превращающая данные в шаблон
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
})();
