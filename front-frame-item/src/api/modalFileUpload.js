import request from "@/request";
import axios from "axios";
import { toFormData } from "../utils/transform";
import { createUuid } from "../utils/common";

export const initiateMultipartUpload = (file) => {
  return request({
    url: `/listing-common/video/init`,
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
      url: "/listing-common/video/uploadPart",
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
    url: `/listing-common/video/complete`,
    method: "post",
    data,
  });
};

// 上传视频封面图
export const uploadCoverImage = (params) => {
  const data = toFormData(params);
  data.append("name", createUuid() + ".jpeg");
  return request({
    url: "/listing-common/video/cover-pic",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};
export const uploadCoverImage_c = (data) => {
  return request({
    url: "/listing-common/video/cover-pic",
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
    url: "/listing-common/upload/video",
    method: "post",
    data,
  });
};

export const fileUpload = (params) => {
  const data = toFormData(params);
  return request({
    url: "/resource/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};

// 获取视频库 视频状态选项
export const getlistingCommonVideoState = (params) => {
  return request({
    url: `/listing-common/video_state`,
    method: "get",
    params,
  });
};
