import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";

import { Logo } from "@/components/icons";

export const Navbar = () => {
  return (
    <NextUINavbar
      style={{
        height: "65pt",
      }}
      className="bg-primary"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit hidden lg:block">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
          </Link>
        </NavbarBrand>
      </NavbarContent>
    </NextUINavbar>
  );
};
