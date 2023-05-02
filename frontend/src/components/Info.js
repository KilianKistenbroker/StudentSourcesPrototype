const Info = ({ currentDirectory, currentFile }) => {
  function formatBytes() {
    const bytes = currentDirectory.size;
    const kilobytes = bytes / 1000;
    const megabytes = bytes / (1000 * 1000);

    if (megabytes >= 1000) {
      const gigabytes = bytes / (1000 * 1000 * 1000);
      return `${gigabytes.toFixed(2)} GB`;
    } else if (kilobytes >= 1000) {
      return `${megabytes.toFixed(2)} MB`;
    } else {
      return `${kilobytes.toFixed(2)} KB`;
    }
  }

  if (currentFile) {
    return (
      <div className="info-content">
        <div>Name:</div>
        <div>{currentFile.name}</div>
        <div>Path:</div>
        <div>{currentFile.pathname}</div>
        <div>Type:</div>
        <div>{currentFile.type}</div>
        <div> Size:</div>
        <div>{formatBytes()}</div>
        <div>Visibility:</div>
        <div>{currentFile.visibility}</div>
      </div>
    );
  } else {
    return (
      <div className="info-content">
        <div>Name:</div>
        <div>{currentDirectory.name}</div>
        <div>Path:</div>
        <div>{currentDirectory.pathname}</div>
        <div>Type:</div>
        <div>{currentDirectory.type}</div>
        <div> Size:</div>
        <div>{formatBytes()}</div>
        <div>Visibility:</div>
        <div>{currentDirectory.visibility}</div>
      </div>
    );
  }
};

export default Info;
