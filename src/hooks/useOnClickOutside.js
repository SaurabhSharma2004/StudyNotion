import { useEffect } from "react";

export function useOnClickOutside (ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if(!ref.current || ref.current.contains(event.target)) return

            handler(event)
        }

        // Add event listeners for mousedown and touchstart events on the document
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        // Cleanup function to remove the event listeners when the component unmounts or when the ref/handler dependencies change
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };

    }, [ref, handler])
}