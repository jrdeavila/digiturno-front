import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";

import LogoColorido from "@/assets/img/logo-ccv-colorido.png";
import useAuth from "@/hooks/use-auth";
import { Button } from "@nextui-org/react";

export const Navbar = () => {
  const { authenticated, logout } = useAuth();
  return (
    <NextUINavbar
      className="bg-white h-[100px] ml-[20px] mt-[20px]"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 h-full sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit hidden lg:flex items-center justify-center">
          <Link
            className="flex justify-center items-center h-full gap-1"
            color="foreground"
            href="/"
          >
            <img src={LogoColorido} style={{
              width: "auto",
              height: "80px",
            }} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="basis-4/5 h-full sm:basis-full" justify="end">
        {
          authenticated && (
            <Button
              className="flex justify-center items-center h-full gap-1 bg-blue-500 text-white font-bold py-1"
              onClick={logout}
            >
              SALIR DEL SISTEMA
            </Button>
          )
        }

      </NavbarContent>

    </NextUINavbar>
  );
};
