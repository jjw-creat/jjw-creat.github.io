(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const seen = new WeakSet();
  const selector = '.profile, .about .intro, .project-card, .award-card, .education, .others-group, .contact, .honors-main > h1';
  const entrance = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!preference.matches) entry.target.classList.add('motion-enter');
      entrance.unobserve(entry.target);
    }
  }, {threshold: .06});
  const scan = () => document.querySelectorAll(selector).forEach(element => {
    if (seen.has(element) || !element.textContent.trim()) return;
    seen.add(element);
    entrance.observe(element);
  });
  const mutations = new MutationObserver(scan);
  for (const root of document.querySelectorAll('main, .profile')) mutations.observe(root, {childList: true, subtree: true});
  scan();
  preference.addEventListener('change', event => {
    if (event.matches) {
      entrance.disconnect();
      mutations.disconnect();
      document.querySelectorAll('.motion-enter').forEach(element => element.classList.remove('motion-enter'));
    }
  });
})();
