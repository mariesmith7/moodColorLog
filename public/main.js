// Waits for the page to fully load
document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.moodCard form');

  deleteButtons.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // stop the normal form submit

      const confirmed = confirm('Are you sure you want to delete this mood?');
      if (!confirmed) return;

      fetch(form.action, {
        method: 'POST',
      })
      .then(response => {
        if (response.ok) {
          form.closest('.moodCard').remove(); // deletes 
          console.error('Failed to delete mood');
        }
      })
      .catch(err => {
        console.error('Error:', err);
      });
    });
  });
});