(() => {
  let navigating = false;
  async function openPage(url, push = true) {
    if (navigating) return;
    navigating = true;
    try {
      const destination = new URL(url, location.href);
      let html;
      if (location.protocol === 'file:') {
        html = window.NODAVEX_PAGES?.[destination.pathname.split('/').pop()];
        if (!html) { location.assign(url); return; }
      } else {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page unavailable');
        html = await response.text();
      }
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const current = document.querySelector('.site-frame');
      const next = parsed.querySelector('.site-frame');
      const previous = new Map([...current.children].map(element => [element.dataset.tabKey, element.getBoundingClientRect().width]));
      const oldPanel = current.querySelector('.page-panel');
      const outgoing = oldPanel.cloneNode(true);
      const outgoingWidth = oldPanel.getBoundingClientRect().width;
      const outgoingScroll = oldPanel.scrollTop;
      const closingTab = [...next.children].find(element => element.dataset.tabKey === oldPanel.dataset.tabKey && element.matches('.page-tab'));
      current.replaceWith(next);
      const number = parsed.querySelector('.active-tab-number');
      document.querySelector('.active-tab-number').replaceWith(number);
      document.title = parsed.title;
      if (push && location.protocol !== 'file:') history.pushState({}, '', url);
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced && matchMedia('(min-width: 701px)').matches) {
        const children = [...next.children];
        const targets = children.map(element => element.getBoundingClientRect().width);
        if (closingTab) {
          outgoing.classList.add('outgoing-content');
          outgoing.style.width = `${outgoingWidth}px`;
          outgoing.removeAttribute('data-tab-key');
          outgoing.removeAttribute('aria-label');
          outgoing.setAttribute('aria-hidden', 'true');
          outgoing.inert = true;
          closingTab.append(outgoing);
          outgoing.scrollTop = outgoingScroll;
        }
        const panel = children.find(element => element.matches('.page-panel'));
        const content = document.createElement('div');
        content.style.width = `${targets[children.indexOf(panel)] - 37}px`;
        while (panel.firstChild) content.append(panel.firstChild);
        panel.append(content);
        const animations = children.map((element, index) => {
          element.style.flex = '0 0 auto';
          element.style.minWidth = '0';
          element.style.maxWidth = 'none';
          element.style.overflow = 'hidden';
          return element.animate([
            { width: `${previous.get(element.dataset.tabKey) ?? 36}px` },
            { width: `${targets[index]}px` }
          ], { duration: 850, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'both' });
        });
        let tracking = true;
        const track = () => {
          number.style.left = `${panel.getBoundingClientRect().left - document.querySelector('.tab-stage').getBoundingClientRect().left}px`;
          if (tracking) requestAnimationFrame(track);
        };
        track();
        await Promise.all(animations.map(animation => animation.finished));
        tracking = false;
        outgoing.remove();
        animations.forEach(animation => animation.cancel());
        children.forEach(element => {
          element.style.removeProperty('flex');
          element.style.removeProperty('min-width');
          element.style.removeProperty('max-width');
          element.style.removeProperty('overflow');
        });
        content.replaceWith(...content.childNodes);
        track();
      }
    } catch {
      location.assign(url);
    } finally { navigating = false; }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('.html') || url.hash) return;
    event.preventDefault();
    openPage(url.href);
  });
  addEventListener('popstate', () => openPage(location.href, false));
})();
