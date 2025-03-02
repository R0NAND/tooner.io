import { Tab } from "../../types/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
import EditableText from "../editable-text/EditableText";
import "./TabsMenu.css";
import { forwardRef } from "react";

interface Props {
  tabs: Tab[];
  desktopWidth: string;
  className: string;
  onClicked: (t: Tab) => void;
  onDeleted: (t: Tab) => void;
  onNameEdited: (newString: string, oldString: string) => boolean;
  onCreateNew: () => void;
}

const TabsMenu = forwardRef<HTMLDivElement, Props>(
  (
    {
      tabs,
      className = "",
      onClicked,
      onDeleted,
      onNameEdited,
      onCreateNew,
    }: Props,
    ref
  ) => {
    return (
      <>
        <div
          className={className}
          ref={ref}
          style={{
            textAlign: "left",
          }}
        >
          {tabs?.map((t, i) => {
            return (
              <div className="tab-menu-item" onClick={() => onClicked(t)}>
                <div key={i} style={{ fontSize: "0.5em" }}>
                  <EditableText onEditCompleted={onNameEdited}>
                    {t.name}
                  </EditableText>
                </div>
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
              </div>
            );
          })}
          <button className="new-tab-button" onClick={() => onCreateNew()}>
            <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
          </button>
        </div>
      </>
    );
  }
);

export default TabsMenu;
