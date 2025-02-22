import { useEffect, useRef, useState } from "react";
import { Tab } from "../types/tabs";
import EditableText from "../components/EditableText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faPause,
  faPlay,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { generateNewString } from "../utils/generateNewString";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTabs from "../defaults/tabs";
import "./TabsPage.css";
import Metronome from "../components/metronome/Metronome";
import Slider from "../components/metronome/Slider";

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
      const newTabs = [...tabs, { name: tabName, tab: "" }];
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

  return (
    <div className="tabs-page">
      <div className="tabs-sidebar">
        <h3>Saved Tabs</h3>
        <div className="tabs-menu">
          {tabs?.map((t, i) => {
            return (
              <div className="tab-menu-item" onClick={() => setSelectedTab(t)}>
                <button
                  className="tab-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTab(t);
                  }}
                >
                  <FontAwesomeIcon
                    fontSize={"1.61em"}
                    icon={faRemove}
                  ></FontAwesomeIcon>
                </button>
                <div key={i}>
                  <EditableText onEditCompleted={onNameEdited}>
                    {t.name}
                  </EditableText>
                </div>
              </div>
            );
          })}
          <button onClick={() => createNewTab()}>
            <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
          </button>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "1em",
        }}
        className="tab-display"
      >
        <textarea
          ref={textAreaRef}
          className="tab-text-area"
          value={selectedTab.tab}
          cols={100}
          onChange={(e) => onTextAreaChange(e.target.value)}
        ></textarea>
      </div>
      <div>
        <h3>Metronome</h3>
        <Metronome></Metronome>
        <h3>Auto-Scroll</h3>
        <button
          onClick={() => {
            setIsScrolling(!isScrolling);
          }}
        >
          <FontAwesomeIcon
            icon={isScrolling ? faPause : faPlay}
          ></FontAwesomeIcon>
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
      </div>
    </div>
  );
};

export default TabsPage;
