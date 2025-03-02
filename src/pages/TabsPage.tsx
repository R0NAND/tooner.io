import { useEffect, useRef, useState } from "react";
import { Tab } from "../types/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { generateNewString } from "../utils/generateNewString";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTabs from "../defaults/tabs";
import "./TabsPage.css";
import Metronome from "../components/metronome/Metronome";
import Slider from "../components/slider/Slider";
import TabsMenu from "../components/tabs-menu/TabsMenu";

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
  return (
    <>
      <div className="tabs-page main-panel">
        <div ref={tabDisplayRef} className="tab-display">
          <textarea
            style={{ fontSize: "0.61em" }}
            ref={textAreaRef}
            className="tab-text-area"
            value={selectedTab.tab}
            cols={80}
            onChange={(e) => onTextAreaChange(e.target.value)}
          ></textarea>
        </div>
        <div className="tabs-page-sidebar">
          <h3 style={{ textAlign: "left", marginBottom: "0.25em" }}>
            Saved Tabs
          </h3>
          <TabsMenu
            className="tabs-menu"
            tabs={tabs}
            desktopWidth={tabsMenuWidth.toString() + "ch"}
            ref={tabsMenuRef}
            onClicked={(t) => setSelectedTab(t)}
            onDeleted={deleteTab}
            onCreateNew={createNewTab}
            onNameEdited={onNameEdited}
          ></TabsMenu>
          <h3 style={{ textAlign: "left", marginBottom: "0.25em" }}>
            Autoscroll
          </h3>
          <div style={{ display: "flex", gap: "0.5em" }}>
            <button
              onClick={() => {
                setIsScrolling(!isScrolling);
              }}
              title={isScrolling ? "stop autoscroll" : "begin autoscroll"}
            >
              <FontAwesomeIcon
                icon={isScrolling ? faPause : faPlay}
              ></FontAwesomeIcon>
            </button>
            <Slider
              value={scrollRate}
              min={10}
              max={100}
              width="100%"
              onChange={(v: number) => {
                setScrollRate(v);
              }}
            ></Slider>
          </div>
          <h3
            style={{
              textAlign: "left",
              marginBottom: "0.25em",
            }}
          >
            Metronome
          </h3>
          <Metronome></Metronome>
        </div>
      </div>
    </>
  );
};

export default TabsPage;
