import { useEffect, useState } from "react";
import uploadJson from "../helpers/uploadJson";

const Notes = ({
  data,
  notes,
  setNotes,
  currentDirectory,
  explorerData,
  setSplashMsg,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const saveInterval = setInterval(() => {
        handleUploadNotes();
      }, 10000); // Save every 10 seconds
      return () => clearInterval(saveInterval); // Cleanup on unmount or when dependencies change
    }
  }, [isFocused, notes]);

  useEffect(() => {
    setNotes(currentDirectory.notes);
  }, [currentDirectory]);

  const handleUploadNotes = () => {
    const oldNotes = currentDirectory.notes;
    if (oldNotes === notes) {
      console.log("prevent unintential upload req in Notes component");
      return;
    }

    currentDirectory.notes = notes;

    const res = uploadJson(data, explorerData);
    if (res === -1) {
      console.log("Failed to save home directory");
    }
    setSplashMsg({ message: "Saved notes", isShowing: true });
  };

  return (
    <textarea
      id="notesText"
      type="text"
      value={notes}
      placeholder="Add notes here"
      onChange={(e) => setNotes(e.target.value)}
      onBlur={() => {
        setIsFocused(false);
        handleUploadNotes();
      }}
      onFocus={() => setIsFocused(true)}
    />
  );
};

export default Notes;
