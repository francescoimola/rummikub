document.querySelectorAll('[aria-controls]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    document.getElementById(btn.getAttribute('aria-controls')).classList.toggle('is-open');
    btn.textContent = expanded ? 'Read more' : 'Read less';
  });
});

document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    var email = a.getAttribute('href').replace('mailto:', '');
    var original = a.textContent;
    navigator.clipboard.writeText(email).then(function () {
      a.textContent = 'Email copied!';
      setTimeout(function () { a.textContent = original; }, 2000);
    });
  });
});
