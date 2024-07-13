import md5 from "js-md5";

import {
  initiateMultipartUpload,
  videoUpload,
  completeMultipartUpload,
} from "@/api/fileUpload";

function getMd5Str(file) {
  return new Promise((resolve) => {
    let fs = new FileReader();
    fs.readAsArrayBuffer(file);
    fs.onload = (e) => {
      const md5Str = md5(e.target.result);
      resolve(md5Str);
    };
  });
}

export function videoSliceUpload(file, progressChange) {
  let uploadId = "";
  let fileMd5 = "";
  const partETags = [];

  return new Promise((resolve, reject) => {
    const upload = () => {
      const chunkSize = 1024 * 1024 * 50;
      const chunk = file.size / chunkSize;
      let x = 0;

      for (let i = 0; i < chunk; i++) {
        videoUpload(
          {
            uploadId,
            partSeq: i + 1,
            partContent: new Blob([
              file.slice(i * chunkSize, (i + 1) * chunkSize),
            ]),
          },
          file.size,
          progressChange
        )
          .then((res) => {
            x += 1;
            partETags.push(res.data.partETag);
            if (x === Math.ceil(chunk)) {
              completeMultipartUpload({
                categoryId: 4,
                uploadId,
                partETags,
                fileMd5,
                type: file.type,
                fileName: file.name,
              })
                .then((res) => {
                  resolve(res);
                })
                .catch((e) => {
                  reject(e);
                });
            }
          })
          .catch((e) => {
            reject(e);
          });
      }
    };

    getMd5Str(file).then((md5Str) => {
      fileMd5 = md5Str;
      initiateMultipartUpload(file.type)
        .then((res) => {
          uploadId = res.data;
          upload();
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
}
