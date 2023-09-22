import { useContext, useEffect } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button } from "./components/ui/button"
import ThemeContext, { ThemeType, isDark, isLight } from "./context/ThemeContext";

const switchTheme = (setTheme: any) => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        setTheme(ThemeType.LIGHT);
    } else {
        setTheme(ThemeType.DARK);
        document.documentElement.setAttribute("data-theme", "dark");
    }
};

export default function ThemeToggle() {
    const { theme, setTheme } = useContext(ThemeContext);

    useEffect(() => {
        let themeColor = "#09090B";
        if (isLight(theme)) {
            themeColor = "#FFFFFF"
        }
        // @ts-ignore
        document.querySelector("meta[name=theme-color]").setAttribute("content", themeColor);

    }, [theme])

    return (
        <Button onClick={() => switchTheme(setTheme)} variant="outline" size="icon">
            {isDark(theme) ? <MoonIcon className="transition-all" /> : <SunIcon className="transition-all" />}
        </Button>
    )
}
