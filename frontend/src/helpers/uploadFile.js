import axios from "../api/axios";

const uploadFile = async (key, file, setLoadingBar) => {
  const type = file.name.split(".").pop();
  const adjustedKey = key + "." + type;
  const formData = new FormData();
  formData.append("file", file, adjustedKey);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: function (progressEvent) {
      setLoadingBar({
        filename: file.name,
        progress: Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        ),
      });
    },
  };

  try {
    console.log("sent");
    const res = await axios.post(
      `/uploadFile/${adjustedKey}`,
      formData,
      config
    );

    return 0;
  } catch (error) {
    return -1;
  }
};

export default uploadFile;

// import axios from "../api/axios";

// const uploadFile = async (key, file) => {
//   const type = file.name.split(".").pop();
//   const adjustedKey = key + "." + type;
//   const formData = new FormData();
//   formData.append("file", file, adjustedKey);

//   const config = {
//     onUploadProgress: function (progressEvent) {
//       let percentCompleted = Math.round(
//         (progressEvent.loaded * 100) / progressEvent.total
//       );
//       console.log("progress: ");
//       console.log(percentCompleted); // replace this with your function to update the loading bar
//     },
//   };

//   try {
//     console.log("sent");
//     const res = axios.post(
//       `/uploadFile/${adjustedKey}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       },
//       config
//     );

//     return 0;
//   } catch (error) {
//     return -1;
//   }
// };

// export default uploadFile;

//  ------------------------------------------------------------------------- break ----------------------------------------------//

// import axios from "../api/axios";

// const uploadFile = async (state, owner_id, key, file) => {
//   if (state === "convert") {

//   } else {
//     const type = file.name.split(".").pop();
//     const adjustedKey = key + "." + type;
//     const formData = new FormData();
//     formData.append("file", file, adjustedKey);
//     try {
//       axios.post(`/attachFile/${adjustedKey}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       return 0;
//     } catch (error) {
//       return -1;
//     }
//   }
// };

// export default uploadFile;
