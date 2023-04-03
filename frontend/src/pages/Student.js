import { useState } from "react";
import DirectoryTree from "../components/DirectoryTree";
import folderData from "../data/folderData";
import useTreeTraversal from "../hooks/useTreeTraversal";

const Student = () => {
  const [explorerData, setExplorerData] = useState(folderData);
  const { insertNode } = useTreeTraversal();
  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(explorerData, folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  return (
    <div className="page">
      <div className="foundation">
        <DirectoryTree
          handleInsertNode={handleInsertNode}
          explorer={explorerData}
        />
      </div>
    </div>
  );
};

export default Student;
