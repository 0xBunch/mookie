export function initFormspree() {
  const form = document.querySelector('.sidebar__form');
  if (!form) {
    return;
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const status = document.getElementById('sidebar-form-status');
    const data = new FormData(event.target);
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: 'application/json'
      }
    })
      .then((response) => {
        form.classList.add('loading');
        if (response.ok) {
          form.classList.remove('loading');
          form.classList.add('success');
          status.innerHTML = 'Thanks for your submission!';
          form.reset();
        } else {
          response.json().then((data) => {
            if (Object.hasOwn(data, 'errors')) {
              form.classList.remove('loading');
              form.classList.add('error');
              status.innerHTML = data['errors'].map((error) => error['message']).join(', ');
            } else {
              form.classList.remove('loading');
              form.classList.add('error');
              status.innerHTML = 'Oops! There was a problem submitting your form';
            }
          });
        }
      })
      .catch((error) => {
        form.classList.remove('loading');
        form.classList.add('error');
        status.innerHTML = 'Oops! There was a problem submitting your form';
      });
  }
  document.addEventListener('submit', handleSubmit);
}
