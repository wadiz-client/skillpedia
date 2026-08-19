const findScrollContainer = (element: HTMLElement): HTMLElement | null => {
  let parentElement = element.parentElement;

  while (parentElement !== null) {
    const { overflowY } = getComputedStyle(parentElement);
    const isScrollable =
      (overflowY === 'auto' || overflowY === 'scroll') && parentElement.scrollHeight > parentElement.clientHeight;

    if (isScrollable) {
      return parentElement;
    }

    parentElement = parentElement.parentElement;
  }

  return null;
};

export const scrollToActiveLink = (element: HTMLElement) => {
  const activeLink = element.querySelector<HTMLElement>('[aria-current="page"]');

  if (activeLink === null) {
    return;
  }

  const scrollContainer = findScrollContainer(activeLink);

  if (scrollContainer === null) {
    return;
  }

  const scrollContainerRect = scrollContainer.getBoundingClientRect();
  const activeLinkRect = activeLink.getBoundingClientRect();
  const isVisible =
    activeLinkRect.top >= scrollContainerRect.top && activeLinkRect.bottom <= scrollContainerRect.bottom;

  if (isVisible) {
    return;
  }

  const centerOffset = (scrollContainerRect.height - activeLinkRect.height) / 2;
  scrollContainer.scrollTop += activeLinkRect.top - scrollContainerRect.top - centerOffset;
};
