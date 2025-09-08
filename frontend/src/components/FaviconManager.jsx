import { useEffect } from 'react';

const FaviconManager = () => {
  useEffect(() => {
    // Đảm bảo favicon được load đúng khi component mount
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = '/favicon.ico';
      document.head.appendChild(link);
    } else {
      // Force reload favicon
      favicon.href = favicon.href;
    }
  }, []);

  return null; // Component này không render gì
};

export default FaviconManager;


