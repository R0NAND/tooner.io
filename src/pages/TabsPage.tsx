import { useEffect, useRef, useState } from "react";
import { Tab } from "../types/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
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
  const [scrollRate, setScrollRate] = useState(10);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (scrollIntervalRef.current !== null) {
      clearInterval(scrollIntervalRef.current);
    }
    if (isScrolling && textAreaRef.current) {
      const lineHeight = parseFloat(
        window.getComputedStyle(textAreaRef.current).lineHeight
      );
      scrollIntervalRef.current = setInterval(() => {
        if (textAreaRef.current) {
          textAreaRef.current.scrollTop += 1;
        }
      }, Math.round(60000 / (scrollRate * lineHeight)));
    }
  }, [isScrolling, scrollRate]);

  const [fontSize, setFontSize] = useState(100);

  const tabsMenuWidth = 20; // In Characters
  const tabsMenuRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div className="tabs-page">
        <div className="tabs-ui main-panel">
          <textarea
            style={{ fontSize: `${(0.00618 * fontSize).toString()}em` }}
            ref={textAreaRef}
            className="tab-text-area classy-scroll"
            value={selectedTab.tab}
            onChange={(e) => onTextAreaChange(e.target.value)}
          ></textarea>
          <div className="tabs-page-sidebar">
            <div
              className="saved-tabs-flex"
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
              }}
            >
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "0.25em",
                  marginTop: "0em",
                }}
              >
                Saved Tabs
              </h3>
              <TabsMenu
                className="tabs-menu classy-scroll"
                tabs={tabs}
                desktopWidth={tabsMenuWidth.toString() + "ch"}
                ref={tabsMenuRef}
                onClicked={(t) => setSelectedTab(t)}
                onDeleted={deleteTab}
                onNameEdited={onNameEdited}
              ></TabsMenu>
              <button
                className="big-button"
                title="Create new tab"
                onClick={() => createNewTab()}
                style={{
                  fontSize: "1em",
                  borderRadius: "0.5em",
                  marginTop: "0.25em",
                  marginBottom: 0,
                }}
              >
                <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
              </button>
            </div>
            <div className="tabs-tools-flex">
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "0.25em",
                  marginTop: 0,
                }}
              >
                Font Size
              </h3>
              <div className="inner-panel" style={{ marginBottom: "0.5em" }}>
                <Slider
                  value={fontSize}
                  min={50}
                  max={150}
                  label="%"
                  width={"100%"}
                  onChange={(v: number) => {
                    setFontSize(v);
                  }}
                ></Slider>
              </div>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "0.25em",
                  marginTop: 0,
                }}
              >
                Autoscroll
              </h3>
              <div
                className="inner-panel"
                style={{ display: "flex", gap: "0.5em", marginBottom: "0.5em" }}
              >
                <button
                  className={`${isScrolling ? "red" : "green"}`}
                  onClick={() => {
                    setIsScrolling(!isScrolling);
                  }}
                  title={isScrolling ? "stop autoscroll" : "begin autoscroll"}
                >
                  <FontAwesomeIcon
                    icon={isScrolling ? faStop : faPlay}
                  ></FontAwesomeIcon>
                </button>
                <Slider
                  value={scrollRate}
                  min={4}
                  max={40}
                  width="100%"
                  label="Lines/Min"
                  onChange={(v: number) => {
                    setScrollRate(v);
                  }}
                ></Slider>
              </div>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "0.25em",
                  marginTop: 0,
                }}
              >
                Metronome
              </h3>
              <div className="inner-panel">
                <Metronome></Metronome>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabsPage;
