"use client";
import { ChevronUp } from "lucide-react";
import { animateScroll } from "react-scroll";
import { useEffect, useState } from "react";
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
  if (!isVisible) {
    return null;
  }
  return (
    <div
      className="fixed bottom-4 right-4 z-50 cursor-pointer rounded-full bg-app-main p-2 text-white"
      onClick={() =>
        animateScroll.scrollToTop({ smooth: "true", duration: 500 })
      }
    >
      <ChevronUp />
    </div>
  );
};

export default ScrollToTop;
