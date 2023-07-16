import { useContext } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Button } from "./components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import ThemeContext, { ThemeType, isDark } from "./context/ThemeContext";

const switchTheme = (setTheme: any) => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        console.log("should set to light")
        document.documentElement.setAttribute("data-theme", "light");
        setTheme(ThemeType.LIGHT);
        console.log(document.documentElement.getAttribute("data-theme"))
    } else {
        console.log("should set to dark")
        setTheme(ThemeType.DARK);
        document.documentElement.setAttribute("data-theme", "dark");
        console.log(document.documentElement.getAttribute("data-theme"))
    }
};

export default function ThemeToggle() {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <Button onClick={() => switchTheme(setTheme)} variant="outline" size="icon">
            {isDark(theme) ? <MoonIcon className="transition-all" /> : <SunIcon className="transition-all" />}
        </Button>
        // <DropdownMenu>
        //     <DropdownMenuTrigger asChild>
        //         <Button variant="outline" size="icon">
        //             <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        //             <span className="sr-only">Toggle theme</span>
        //         </Button>
        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent align="end">
        //         <DropdownMenuItem onClick={() => switchTheme(setTheme)}>
        //             Light
        //         </DropdownMenuItem>
        //         <DropdownMenuItem onClick={() => switchTheme(setTheme)}>
        //             Dark
        //         </DropdownMenuItem>
        //     </DropdownMenuContent>
        // </DropdownMenu>
    )
}
