const Info = ({ currentDirectory, currentFile }) => {
  function formatBytes() {
    const bytes = JSON.parse(JSON.stringify(currentDirectory.size));
    const megabytes = bytes / (1024 * 1024);

    if (megabytes >= 1000) {
      const gigabytes = bytes / (1024 * 1024 * 1024);
      return `${gigabytes.toFixed(2)} GB`;
    } else {
      return `${megabytes.toFixed(2)} MB`;
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
