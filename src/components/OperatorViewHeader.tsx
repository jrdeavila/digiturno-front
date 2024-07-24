import React from "react";
import useAuth from "@/hooks/use-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { Logo } from "./icons";

const OperatorViewHeader: React.FC = () => {
  const { attendant, logout } = useAuth();
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
      <NavbarContent className="basis-2/5 sm:basis-full" justify="center">
        <div className="flex justify-center items-center">
          <span className="text-white text-lg font-bold">
            {attendant?.name}
          </span>
        </div>
      </NavbarContent>
      <NavbarContent className="basis-2/5 sm:basis-full" justify="end">
        <div className="flex justify-end items-center">
          <button
            className="flex flex-row items-center justify-center text-white bg-secondary hover:bg-primary-dark rounded-lg px-4 py-2"
            onClick={logout}
          >
            <FontAwesomeIcon icon={faSignOut} className="mr-2" />
            <span className="font-bold">SALIR</span>
          </button>
        </div>
      </NavbarContent>
    </NextUINavbar>
  );
};

export default OperatorViewHeader;
