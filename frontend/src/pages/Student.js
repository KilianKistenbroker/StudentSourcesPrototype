import { useState } from "react";
import DirectoryTree from "../components/DirectoryTree";
import folderData from "../data/folderData";
import useTreeTraversal from "../hooks/useTreeTraversal";
import StudentSearch from "../components/StudentSearch";

const Student = () => {
  const [explorerData, setExplorerData] = useState(folderData);
  const { insertNode } = useTreeTraversal();
  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(explorerData, folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  return (
    <div className="page">
      <div className="grid-foundation">
        <div className="left-panel-grid">
          <div className="left-panel-title">Explorer</div>
          <div className="left-panel-tree">
            <DirectoryTree
              handleInsertNode={handleInsertNode}
              explorer={explorerData}
            />
          </div>
          <div className="left-panel-chatbot">ask chatbot</div>
          <div className="left-panel-textbox">textbox</div>
        </div>

        <div className="right-panel-grid">
          <div className="right-panel-title">Home</div>
          <div className="right-panel-info">info</div>
          <div className="right-panel-notes">notes</div>
          <div className="right-panel-coments">comments</div>
          <div className="right-panel-textbox">textbox</div>
        </div>

        <div className="main-panel-grid">
          <StudentSearch />
          <div className="main-panel-content">main content</div>
          <div className="tiny-footer">Trach Can</div>
        </div>
      </div>
    </div>
  );
};

export default Student;
