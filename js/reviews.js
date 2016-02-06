/* global reviews: true */
'use strict';
(function() {
  var reviewsFilter = document.querySelector('.reviews-filter');
  reviewsFilter.classList.add('invisible');

  var reviewsContainer = document.querySelector('.reviews-list');

  reviews.forEach(function(item, i) {
    var review = getReviewTemplate(item);
    reviewsContainer.appendChild(review);
  });


