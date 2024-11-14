import { useState, useEffect } from 'react';

export function useKakaoLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadKakaoMap = () => {
      // 이미 로드된 경우
      if (window.kakao && window.kakao.maps) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=8e612bee3d25ae70ca8f4c0ab521877e&libraries=services&autoload=false`;
      
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            setIsLoaded(true);
          });
        }
      };

      document.body.appendChild(script);
    };

    loadKakaoMap();

    // cleanup
    return () => {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return isLoaded;
}