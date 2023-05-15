import { useEffect, useState } from "react";
import uploadJson from "../helpers/uploadJson";

const Notes = ({ data, currentDirectory, explorerData, setSplashMsg }) => {
  const [notes, setNotes] = useState("");
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
    console.log(currentDirectory.notes);
    setNotes(currentDirectory.notes);
  }, [currentDirectory]);

  const handleUploadNotes = () => {
    const oldNotes = currentDirectory.notes;
    if (oldNotes === notes) {
      console.log("prevent unintential upload req in Notes component");
      return;
    }

    currentDirectory.notes = notes;

    const res = uploadJson(data.id, explorerData);
    if (res === -1) {
      console.log("Failed to save home directory");
    }
    setSplashMsg({ message: "Saved notes", isShowing: true });
    console.log(explorerData);
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
