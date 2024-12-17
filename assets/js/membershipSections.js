export const initMembershipSections = () => {
  const membershipSections = document.querySelectorAll('.membership-page');

  if (membershipSections.length) {
    membershipSections.forEach((section) => {
      const monthlyPlanBtn = section.querySelector('.membership-page__toggle-btn--monthly');
      const yearlyPlanBtn = section.querySelector('.membership-page__toggle-btn--yearly');
      const toggleBtn = section.querySelector('.membership-page__toggle');

      yearlyPlanBtn.addEventListener('click', () => {
        section.classList.add('yearly');
      });

      monthlyPlanBtn.addEventListener('click', () => {
        section.classList.remove('yearly');
      });

      toggleBtn.addEventListener('click', () => {
        section.classList.toggle('yearly');
      });
    });
  }
};
