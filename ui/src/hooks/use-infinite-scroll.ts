import { useEffect, MutableRefObject } from 'react';

function useInfiniteScroll(
    ref: MutableRefObject<null | HTMLDivElement>,
    callback: () => void
) {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Check if the element is intersecting (visible)
                if (entries[0].isIntersecting) {
                    callback();
                }
            },
            {
                threshold: 1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [callback]);
}

export default useInfiniteScroll;
