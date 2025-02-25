import { Tab } from "../../types/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faClose,
  faList,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import EditableText from "../editable-text/EditableText";
import "./TabsMenu.css";
import { forwardRef, useEffect, useState } from "react";

interface Props {
  tabs: Tab[];
  desktopWidth: string;
  isMobileMenu: boolean;
  onClicked: (t: Tab) => void;
  onDeleted: (t: Tab) => void;
  onNameEdited: (newString: string, oldString: string) => boolean;
  onCreateNew: () => void;
}

const TabsMenu = forwardRef<HTMLDivElement, Props>(
  (
    {
      tabs,
      desktopWidth,
      isMobileMenu,
      onClicked,
      onDeleted,
      onNameEdited,
      onCreateNew,
    }: Props,
    ref
  ) => {
    const [isMinimized, setIsMinimized] = useState(false);
    useEffect(() => {
      if (isMobileMenu) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    }, [isMobileMenu]);
    return (
      <>
        <div
          ref={ref}
          style={{
            width: isMobileMenu ? "100%" : desktopWidth,
            textAlign: "left",
            transform: isMobileMenu && isMinimized ? "translateX(-100%)" : "",
            transition: isMobileMenu //Very hard to read, but also effective animation solution
              ? "transform 0.3s ease-in-out, width 0s 0.3s"
              : isMinimized
              ? "transform 0.3s ease-in-out"
              : "transform 0.3s ease-in-out, width 0.3s ease-in-out",
          }}
          className="tabs-sidebar"
        >
          <button
            style={{ display: isMobileMenu ? "inline" : "none" }}
            onClick={() => {
              setIsMinimized(true);
            }}
          >
            <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
          </button>
          <h3>Saved Tabs</h3>
          <div className="tabs-menu">
            {tabs?.map((t, i) => {
              return (
                <div className="tab-menu-item" onClick={() => onClicked(t)}>
                  <button
                    className="tab-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleted(t);
                    }}
                  >
                    <FontAwesomeIcon
                      fontSize={"1em"}
                      icon={faRemove}
                    ></FontAwesomeIcon>
                  </button>
                  <div key={i} style={{ fontSize: "0.5em" }}>
                    <EditableText onEditCompleted={onNameEdited}>
                      {t.name}
                    </EditableText>
                  </div>
                </div>
              );
            })}
            <button onClick={() => onCreateNew()}>
              <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
            </button>
          </div>
        </div>
        <button
          style={{
            position: "absolute",
            top: "0.5em",
            left: "0.5em",
            display: isMinimized ? "inline" : "none",
          }}
          onClick={() => {
            setIsMinimized(false);
          }}
        >
          <FontAwesomeIcon icon={faList}></FontAwesomeIcon>
        </button>
      </>
    );
  }
);

export default TabsMenu;
