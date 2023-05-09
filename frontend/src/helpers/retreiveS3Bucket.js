// -- temp. will be retreiving from s3 bucket later on -- //
import folderData from "../data/folderData";

const retreiveJSON = async (setExplorerData) => {
  setExplorerData(folderData);
};

export default retreiveJSON;
