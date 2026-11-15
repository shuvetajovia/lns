import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteScroll() {
  const { pathname, search, hash, key } = useLocation();
  useLayoutEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search, hash, key]);
  return null;
}
