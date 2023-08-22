import { useContext } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button } from "./components/ui/button"
import ThemeContext, { ThemeType, isDark } from "./context/ThemeContext";

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

    return (
        <Button onClick={() => switchTheme(setTheme)} variant="outline" size="icon">
            {isDark(theme) ? <MoonIcon className="transition-all" /> : <SunIcon className="transition-all" />}
        </Button>
    )
}
