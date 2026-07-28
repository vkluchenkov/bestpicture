import { useCallback, useEffect, useRef } from 'react';

const MARKER = 'popupHistory';

let pendingPop = false;

/**
 * Pops the popup's own entry once the current commit has settled. Deferring it
 * lets a popup that mounts in the same commit cancel the pop and take the entry
 * over instead — that covers both the add-to-cart handoff and StrictMode's
 * simulated remount in dev, where an immediate `back()` would close the popup
 * right after it opened.
 */
const schedulePop = () => {
  pendingPop = true;
  queueMicrotask(() => {
    if (!pendingPop) return;
    pendingPop = false;
    if (window.history.state?.[MARKER]) window.history.back();
  });
};

/**
 * Pushes a history entry while a popup is open so the browser Back button closes
 * the popup instead of leaving the page.
 *
 * Returns `releaseHistoryEntry`: call it when the popup is closing because
 * something else takes over its entry — a navigation (`router.replace`) or another
 * popup opening in the same commit. Without it the unmount cleanup would pop the
 * entry and the resulting popstate cancels the in-flight navigation.
 *
 * Assumes nothing navigable is reachable while a popup is open (the overlays sit
 * above the header): a route change would unmount the popup and pop its entry out
 * from under the navigation.
 */
export const usePopupHistory = (onClose: () => void) => {
  const skipPopRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    pendingPop = false; // whoever just unmounted hands its entry to us

    const prevScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    // If a popup entry is already current (add-to-cart hands the product popup
    // over to the cart), take it over instead of stacking a second entry.
    const state = { [MARKER]: true };
    if (window.history.state?.[MARKER]) window.history.replaceState(state, '');
    else window.history.pushState(state, '');

    const handlePopState = () => onCloseRef.current();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Marker still current => closed programmatically (ESC / click / button)
      // and nobody claimed the entry, so pop it ourselves. Closed by Back => the
      // entry is already gone. Released => the caller consumes it.
      if (!skipPopRef.current && window.history.state?.[MARKER]) schedulePop();
      window.history.scrollRestoration = prevScrollRestoration;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useCallback(() => {
    skipPopRef.current = true;
  }, []);
};
