import { useContext } from "react";
import ThemeToggle from "./theme-toggle";
import ThemeContext, { isDark } from "./context/ThemeContext";

export default function Nav() {

    const { theme } = useContext(ThemeContext);
    
    return (
        <nav className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold">
                <svg width="90" height="69" viewBox="0 0 905 688" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M437 340.733C470.333 359.978 470.333 408.09 437 427.335L203 562.435C169.667 581.68 128 557.624 128 519.134V248.934C128 210.444 169.667 186.388 203 205.633L437 340.733Z" fill={isDark(theme) ? "#F4F5F8" : "#222326"} />
                    <path d="M395.882 502.88C385.02 513.433 384.717 530.919 396.413 540.583C415.208 556.113 436.162 568.921 458.657 578.585C489.588 591.873 522.829 598.956 556.482 599.43C590.135 599.904 623.541 593.76 654.793 581.348C677.523 572.321 698.79 560.107 717.968 545.111C729.901 535.78 730.037 518.292 719.443 507.436V507.436C708.849 496.581 691.549 496.513 679.346 505.491C665.528 515.659 650.428 524.04 634.402 530.404C609.85 540.155 583.606 544.982 557.168 544.61C530.73 544.237 504.617 538.673 480.318 528.234C464.457 521.421 449.572 512.617 436.013 502.064C424.04 492.745 406.744 492.326 395.882 502.88V502.88Z" fill={isDark(theme) ? "#F4F5F8" : "#222326"} />
                </svg>
            </h1>
            <ThemeToggle />
        </nav>
    )
}