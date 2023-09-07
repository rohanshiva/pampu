import ThemeToggle from "./theme-toggle";

export default function Nav() {
    return (
        <nav className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold">
                Pampu! 🍋
            </h1>
            <ThemeToggle />
        </nav>
    )
}