'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var form = document.querySelector('.review-form');
  var formSubmit = document.querySelector('.review-submit');
  formSubmit.setAttribute('disabled', 'disabled');
  var fieldName = document.querySelector('#review-name');
  var fieldText = document.querySelector('#review-text');


  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  form.addEventListener('change', function(evt) {
    evt.preventDefault();
    var fieldLabel = document.querySelector('.review-fields label[for=\"review-text\"]');

    if (getMark() < 4) {
      fieldLabel.style.display = 'inline';
      if (validateField(fieldName) && validateField(fieldText)) {
        formSubmit.removeAttribute('disabled');
      } else {
        formSubmit.setAttribute('disabled', 'disabled');
      }
    } else {
      fieldLabel.style.display = 'none';
      if (validateField(fieldName)) {
        formSubmit.removeAttribute('disabled');
      } else {
        formSubmit.setAttribute('disabled', 'disabled');
      }
    }
  });

  /**
   * Функция которая возвращает текущую оценку
   * @return {number}
   */
  function getMark() {
    var formRadio = document.querySelector('.review-form-group-mark input[name=\"review-mark\"]:checked');
    return formRadio.value;
  }

  /**
   * Функция которая проверяет поле на заполненность
   * @return {boolean}
   */
  function validateField(field) {
    var fieldValue = field.value;
    var fieldId = field.id;
    var fieldLabel = document.querySelector('.review-fields label[for=\"' + fieldId + '\"]');
    if (fieldValue === '') {
      fieldLabel.style.display = 'inline';
      return false;
    } else {
      fieldLabel.style.display = 'none';
      return true;
    }
  }
})();
