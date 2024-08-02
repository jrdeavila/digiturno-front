import backgrond from "@/assets/img/Fondo3.png";
import styled from "styled-components";

export default function DefaultLayout({
  children,
  className = "container mx-auto max-w-7xl px-6 flex-grow pt-16",
}: {
  children: React.ReactNode;
  className?: string;
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
      <main className={className}>
        {children}
      </main>
    </DefaultBackground>
  );
}

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
        background-color:  #EDEDED;
        height: 33.33%;
      }

      #f2 {
        background-color: #0070B3;
        height: 33.33%;
      }

      #f3 {
        background-color: #00204D;
        height: 33.33%;
      }

   }

`

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
        background-color:  #EDEDED;
        width: 33.33%;
      }

      #f2 {
        background-color: #0070B3;
        width: 33.33%;
      }

      #f3 {
        background-color: #00204D;
        width: 33.33%;
      }

   }

`



const DefaultBackground = styled.div`
  background-image: url(${backgrond});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`