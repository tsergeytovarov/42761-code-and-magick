/* global docCookies: true */
'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var form = document.querySelector('.review-form');
  var formSubmit = document.querySelector('.review-submit');
  formSubmit.setAttribute('disabled', 'disabled');
  var fields = document.querySelector('.review-fields');
  var fieldName = document.querySelector('#review-name');
  var fieldText = document.querySelector('#review-text');
  var fieldLabel = document.querySelector('.review-fields label[for=\"review-text\"]');
  var formMark = form.elements.namedItem('review-mark');

  if (docCookies) {
    if (docCookies.getItem('name') !== null) {
      fieldName.value = docCookies.getItem('name');
    }
    if (docCookies.getItem('mark') !== null) {
      formMark.value = docCookies.getItem('mark');
    }
  }

  if (formMark.value > 2) {
    fieldLabel.classList.add('invisible');
  }

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  form.addEventListener('change', function() {
    if (formMark.value < 3) {
      fieldLabel.classList.remove('invisible');
      var isValidName = validateField(fieldName);
      var isValidText = validateField(fieldText);
      if (isValidName && isValidText) {
        formSubmit.removeAttribute('disabled');
        fields.classList.add('invisible');
      } else {
        formSubmit.setAttribute('disabled', 'disabled');
        fields.classList.remove('invisible');
      }
    } else {
      fieldLabel.classList.add('invisible');
      if (validateField(fieldName)) {
        formSubmit.removeAttribute('disabled');
        fields.classList.add('invisible');
      } else {
        formSubmit.setAttribute('disabled', 'disabled');
        fields.classList.remove('invisible');
      }
    }
  });

  form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    var myBirthdatDay = new Date('2015-04-08');
    var today = +Date.now();
    var betweenDates = today - myBirthdatDay.valueOf();
    betweenDates = today + betweenDates;
    var betweenDatesFormatted = new Date(betweenDates).toUTCString();

    document.cookie = 'mark=' + formMark.value + ';expires=' + betweenDatesFormatted;
    document.cookie = 'name=' + fieldName.value + ';expires=' + betweenDatesFormatted;

    form.submit();
  });

  /**
   * Функция которая проверяет поле на заполненность
   * @param {Element} field
   * @return {boolean}
   */
  function validateField(field) {
    var fieldValue = field.value;
    var fieldId = field.id;
    var fieldLabelCurrent = document.querySelector('.review-fields label[for=\"' + fieldId + '\"]');
    if (fieldValue === '') {
      fieldLabelCurrent.classList.remove('invisible');
      return false;
    } else {
      fieldLabelCurrent.classList.add('invisible');
      return true;
    }
  }
})();
