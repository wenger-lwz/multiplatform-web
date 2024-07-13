import request from "@/request";
import axios from "axios";
import { toFormData } from "../utils/transform";
import { createUuid } from "../utils/common";
const prefix =
  process.env.NODE_ENV === "localhost" ? "http://172.30.50.6:8081" : "/media";

export const initiateMultipartUpload = (file) => {
  return request({
    url: prefix + `/video/initiateMultipartUpload`,
    method: "get",
    params: {
      type: file.type,
      name: file.name,
    },
  });
};

export const videoUpload = (paramsData) => {
  const data = new FormData();
  data.append("uploadId", paramsData.uploadId);
  data.append("partSeq", paramsData.partSeq);
  data.append("partContent", paramsData.partContent);
  const CancelToken = axios.CancelToken;
  const videoSliceUpload = {
    abort: null,
  };
  const uploadSend = () => {
    return request({
      url: prefix + "/video/uploadPart",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
      onUploadProgress: function (progressEvent) {
        // console.log(params.partSeq, progressEvent)
        let loaded = Math.floor(progressEvent.loaded);
        let ptotal = Math.floor(progressEvent.total);
        let complete = (loaded / ptotal) * (ptotal / paramsData.file.size);
        paramsData.progressChange(paramsData.partSeq, complete);
      },
      cancelToken: new CancelToken(function (c) {
        videoSliceUpload.abort = c;
      }),
    });
  };
  return {
    uploadSend,
    abort: () => {
      videoSliceUpload.abort();
    },
  };
};

export const completeMultipartUpload = (data) => {
  return request({
    url: prefix + `/video/completeMultipartUpload`,
    method: "post",
    data,
  });
};

// 上传视频封面图
export const uploadCoverImage = (params) => {
  const data = toFormData(params);
  data.append("name", createUuid() + ".jpeg");
  return request({
    url: prefix + "/video/uploadCoverImage",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};
export const uploadCoverImage_c = (data) => {
  return request({
    url: prefix + "/video/uploadCoverImage",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};

// 上传视频确认按钮
export const saveVideoInfo = (data) => {
  return request({
    url: prefix + "/video/saveVideoInfo",
    method: "post",
    data,
  });
};

export const fileUpload = (params) => {
  const data = toFormData(params);
  return request({
    url: prefix + "/resource/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};
export const fileUpload_c = (data) => {
  return request({
    url: prefix + "/resource/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};

export const saveBindSku = (data) => {
  return request({
    url: prefix + "/resource/saveBindSku",
    method: "post",
    data,
  });
};

export const saveVideoInfoBind = (data) => {
  return request({
    url: prefix + "/video/saveVideoInfoBind",
    method: "post",
    data,
  });
};
