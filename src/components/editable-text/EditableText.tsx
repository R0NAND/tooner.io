import { useEffect, useRef, useState } from "react";
import "./EditableText.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface Props {
  children: string;
  className?: string;
  onEditCompleted: (newString: string, oldString: string) => boolean;
}

const EditableText = ({ children, className = "", onEditCompleted }: Props) => {
  const [transitoryValue, setTransitoryValue] = useState(children);
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const onFocusRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    //calcWidth();
    setTransitoryValue(children);
  }, [children]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={className}
      style={{ display: "flex", width: "fit-content" }}
      onMouseEnter={() => setIsEditButtonVisible(true)}
      onMouseLeave={() => setIsEditButtonVisible(false)}
    >
      <button
        className={`editable-text-button ${
          isEditButtonVisible && !isEditing ? "show" : ""
        }`}
        onClick={() => {
          setIsEditing(true);
        }}
      >
        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
      </button>
      {isEditing ? (
        <input
          ref={inputRef}
          className="editable-text-input"
          type="text"
          value={transitoryValue}
          onFocus={(e) => {
            onFocusRef.current = e.target.value;
          }}
          onChange={(e) => {
            setTransitoryValue(e.target.value);
          }}
          onBlur={(e) => {
            if (!onEditCompleted(e.target.value, onFocusRef.current)) {
              setTransitoryValue(onFocusRef.current);
            }
            setIsEditing(false);
            onFocusRef.current = "";
          }}
          onKeyDown={handleKeyDown}
        ></input>
      ) : (
        <div className="editable-text-div" title={transitoryValue}>
          {transitoryValue}
        </div>
      )}
    </div>
  );
};

export default EditableText;
