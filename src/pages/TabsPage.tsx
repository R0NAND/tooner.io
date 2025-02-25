import { useEffect, useRef, useState } from "react";
import { Tab } from "../types/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faPause,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { generateNewString } from "../utils/generateNewString";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTabs from "../defaults/tabs";
import "./TabsPage.css";
import Metronome from "../components/metronome/Metronome";
import Slider from "../components/slider/Slider";
import TabsMenu from "../components/tabs-menu/TabsMenu";
import { measureTextWidth } from "../utils/measureTextWidth";

const TabsPage = () => {
  const [tabs, setTabs] = useLocalStorageArray<Tab>("tabs", defaultTabs);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const onNameEdited = (newName: string, oldString: string) => {
    if (newName !== "") {
      const newTabs = tabs.map((t) => {
        if (t.name === oldString) {
          return { name: newName, tab: t.tab };
        } else {
          return t;
        }
      });
      setTabs(newTabs);
      return true;
    } else {
      return false;
    }
  };

  const createNewTab = () => {
    if (tabs !== undefined) {
      const names = tabs.map((t) => {
        return t.name;
      });
      const tabName = generateNewString(names, "New Tab ");
      const newTabs = [
        ...tabs,
        { name: tabName, tab: "Copy and paste your tab in here!" },
      ];
      setTabs(newTabs);
    }
  };

  const deleteTab = (deletedTab: Tab) => {
    const newTabs = tabs.filter((t) => t !== deletedTab);
    setTabs(newTabs);
  };

  const onTextAreaChange = (newContent: string) => {
    const newSelectedTab = { name: selectedTab.name, tab: newContent };
    const newTabs = tabs.map((t) => {
      return t.name === selectedTab.name ? newSelectedTab : t;
    });
    setSelectedTab(newSelectedTab);
    setTabs(newTabs);
  };

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollRate, setScrollRate] = useState(20);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (scrollIntervalRef.current !== null) {
      clearInterval(scrollIntervalRef.current);
    }
    if (isScrolling) {
      scrollIntervalRef.current = setInterval(() => {
        if (textAreaRef.current) {
          textAreaRef.current.scrollTop += 1;
        }
      }, Math.round(1500 / scrollRate));
    }
  }, [isScrolling, scrollRate]);

  const tabsMenuWidth = 20; // In Characters
  const tabsMenuRef = useRef<HTMLDivElement | null>(null);
  const tabDisplayRef = useRef<HTMLDivElement | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const isIntersecting = () => {
      if (tabDisplayRef.current) {
        const font = window
          //@ts-ignore
          .getComputedStyle(tabDisplayRef.current, null)
          .getPropertyValue("font");
        const menuWidthApproximation = measureTextWidth(
          "0".repeat(tabsMenuWidth),
          font
        );
        return (
          menuWidthApproximation >
          tabDisplayRef.current.getBoundingClientRect().left
        );
      }
    };

    const onResize = () => {
      if (isIntersecting()) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    onResize();
    addEventListener("resize", () => {
      onResize();
    });
  }, []);
  return (
    <>
      <div ref={tabDisplayRef} className="tab-display">
        <textarea
          style={{ fontSize: "0.61em" }}
          ref={textAreaRef}
          className="tab-text-area"
          value={selectedTab.tab}
          cols={80}
          onChange={(e) => onTextAreaChange(e.target.value)}
        ></textarea>
        <div
          style={{ display: "flex", fontSize: "0.5em", alignItems: "center" }}
        >
          <button
            onClick={() => {
              setIsScrolling(!isScrolling);
            }}
            title={isScrolling ? "stop autoscroll" : "begin autoscroll"}
            style={{ fontSize: "2em" }}
          >
            {isScrolling ? (
              <FontAwesomeIcon icon={faPause}></FontAwesomeIcon>
            ) : (
              <div style={{ position: "relative" }}>
                <FontAwesomeIcon icon={faScroll}></FontAwesomeIcon>
                <FontAwesomeIcon
                  style={{
                    fontSize: "0.8em",
                    position: "absolute",
                    color: "black",
                    top: "-0.1em",
                    left: "0.38em",
                  }}
                  icon={faArrowDown}
                ></FontAwesomeIcon>
              </div>
            )}
          </button>
          <Slider
            value={scrollRate}
            min={10}
            max={100}
            width="20em"
            onChange={(v: number) => {
              setScrollRate(v);
            }}
          ></Slider>
          <Metronome></Metronome>
        </div>
      </div>

      <TabsMenu
        tabs={tabs}
        desktopWidth={tabsMenuWidth.toString() + "ch"}
        isMobileMenu={isMobileView}
        ref={tabsMenuRef}
        onClicked={(t) => setSelectedTab(t)}
        onDeleted={deleteTab}
        onCreateNew={createNewTab}
        onNameEdited={onNameEdited}
      ></TabsMenu>
    </>
  );
};

export default TabsPage;
