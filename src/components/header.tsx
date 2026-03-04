import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const Header = () => {
  return (
    <header className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border bg-background px-4">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Logo />
          <p className="select-none">BETTER-AUTH.</p>
        </div>
      </Link>

      <ThemeToggle />
    </header>
  );
};

export default Header;
