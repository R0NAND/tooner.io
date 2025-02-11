import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs } from "../types/tabs";
import EditableText from "../components/EditableText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { generateNewString } from "../utils/generateNewString";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTabs from "../defaults/tabs";
import "./TabsPage.css";

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

  const onTextAreaChange = (newContent: string) => {
    const newSelectedTab = { name: selectedTab.name, tab: newContent };
    const newTabs = tabs.map((t) => {
      return t.name === selectedTab.name ? newSelectedTab : t;
    });
    setSelectedTab(newSelectedTab);
    setTabs(newTabs);
  };

  return (
    <div className="tabs-page">
      <div className="tabs-menu">
        {tabs?.map((t, i) => {
          return (
            <div
              key={i}
              className="tab-menu-item"
              style={{ width: "20ch" }}
              onClick={() => setSelectedTab(t)}
            >
              <EditableText onEditCompleted={onNameEdited}>
                {t.name}
              </EditableText>
            </div>
          );
        })}
        <button onClick={() => createNewTab()}>
          <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
        </button>
      </div>
      <div className="tab-display">
        <h2>{selectedTab.name}</h2>
        <textarea
          value={selectedTab.tab}
          onChange={(e) => onTextAreaChange(e.target.value)}
          rows={50}
          cols={100}
        ></textarea>
      </div>
    </div>
  );
};

export default TabsPage;
