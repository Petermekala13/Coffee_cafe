(function() {
  emailjs.init('3htydY1_79tDzIQDP'); // Replace with your EmailJS User ID
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();

  emailjs.sendForm('service_bwxnszk', 'template_oseih64', this)
    .then(function(response) {
      document.getElementById('contact-message').innerText = 'Message sent successfully!';
      document.getElementById('contact-message').style.display = 'block';
      document.getElementById('contact-form').reset();
    }, function(error) {
      document.getElementById('contact-message').innerText = 'Failed to send message: ' + error.text;
      document.getElementById('contact-message').style.display = 'block';
    });
});