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
    var reviewTemplate = document.querySelector('#review-template');

    var reviewElement;

    /* for IE */
    if ('content' in reviewTemplate) {
      reviewElement = reviewTemplate.content.children[0].cloneNode(true);
    } else {
      reviewElement = reviewTemplate.children[0].cloneNode(true);
    }

    var reviewText = reviewElement.querySelector('.review-text');

    var reviewRatiogOld = reviewElement.querySelector('.review-rating');
    reviewElement.removeChild(reviewRatiogOld);

    var reviewRatingNew;

    var ratingContainer = document.createElement('div');
    ratingContainer.classList.add('ratingContainer');
    reviewElement.insertBefore(ratingContainer, reviewText);
    var rating = data.rating;
    console.log(rating);

    for (var i = 0; i < rating; i++) {
      reviewRatingNew = document.createElement('span');
      reviewRatingNew.classList.add('review-rating');
      ratingContainer.appendChild(reviewRatingNew);
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
})();
