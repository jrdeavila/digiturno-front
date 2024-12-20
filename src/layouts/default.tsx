import backgrond from "@/assets/img/Fondo3.png";
import logo from "@/assets/img/logo-ccv-colorido.png";
import useMyModule from "@/hooks/use-my-module";
import { faCog, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import styled from "styled-components";

export default function DefaultLayout({
  children,
  className = "container mx-auto max-w-7xl px-6 flex-grow pt-16",
  showLogo = false,
}: {
  children: React.ReactNode;
  className?: string;
  showLogo?: boolean;
}) {
  return (
    <DefaultBackground className="relative flex flex-col h-screen">
      <DynamicHorizontalBar>
        <div id="bar">
          <div id="f1"></div>
          <div id="f2"></div>
          <div id="f3"></div>
        </div>
      </DynamicHorizontalBar>

      <DynamicVerticalBar>
        <div id="bar">
          <div id="f1"></div>
          <div id="f2"></div>
          <div id="f3"></div>
        </div>
      </DynamicVerticalBar>
      <main className={className}>{children}</main>
      {showLogo && (
        <img
          src={logo} 
          alt="logo"
          className="absolute bottom-0 left-[calc(50%-12rem)] h-20 w-96"
        />
      )}
      <Settings />
    </DefaultBackground>
  );
}

const Settings = () => {
  const { clearModuleInfo } = useMyModule();
  return (
    <Popover>
      <PopoverTrigger>
        <SettingButton>
          <FontAwesomeIcon icon={faCog} size="2x" />
        </SettingButton>
      </PopoverTrigger>
      <PopoverContent>
        <Listbox>
          <ListboxItem key="1">
            <div className="cursor-pointer" onClick={clearModuleInfo}>
              <FontAwesomeIcon icon={faDesktop} className="mr-1" />
              <span>Borrar configuración del modulo</span>
            </div>
          </ListboxItem>
        </Listbox>
      </PopoverContent>
    </Popover>
  );
};

const SettingButton = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: #19255a;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  margin: 1rem;
  z-index: 1000;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0070b3;
  }
`;

const DynamicVerticalBar = styled.div`
  position: fixed;
  height: 100vh;
  width: 20px;
  top: 0;
  left: 0;

  #bar {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    #f1 {
      background-color: #ededed;
      height: 33.33%;
    }

    #f2 {
      background-color: #0070b3;
      height: 33.33%;
    }

    #f3 {
      background-color: #00204d;
      height: 33.33%;
    }
  }
`;

const DynamicHorizontalBar = styled.div`
  position: fixed;
  width: calc(100% - 250px);
  height: 20px;
  top: 0;
  left: 0;
  background-color: #19255a;

  #bar {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    #f1 {
      background-color: #ededed;
      width: 33.33%;
    }

    #f2 {
      background-color: #0070b3;
      width: 33.33%;
    }

    #f3 {
      background-color: #00204d;
      width: 33.33%;
    }
  }
`;

const DefaultBackground = styled.div`
  background-image: url(${backgrond});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;
