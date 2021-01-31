// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
require("dotenv").config();
("use strict");

async function main() {
  // [START video_streaming_object_tracking_beta]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  console.log(__dirname);
  const path = "./video2.mkv";
  const {
    StreamingVideoIntelligenceServiceClient
  } = require("@google-cloud/video-intelligence").v1p3beta1;
  const fs = require("fs");

  // Instantiates a client
  const client = new StreamingVideoIntelligenceServiceClient();
  // Streaming configuration
  const configRequest = {
    videoConfig: {
      feature: "STREAMING_OBJECT_TRACKING"
    }
  };
  const readStream = fs.createReadStream(path, {
    highWaterMark: 5 * 1024 * 1024, //chunk size set to 5MB (recommended less than 10MB)
    encoding: "base64"
  });
  //Load file content
  const chunks = [];
  readStream
    .on("data", chunk => {
      const request = {
        inputContent: chunk.toString()
      };
      chunks.push(request);
    })
    .on("close", () => {
      // configRequest should be the first in the stream of requests
      stream.write(configRequest);
      for (let i = 0; i < chunks.length; i++) {
        stream.write(chunks[i]);
      }
      stream.end();
    });
  const entities = {};
  frames = [];
  const options = { timeout: 120000 };
  // Create a job using a long-running operation
  const clientHandler = client.streamingAnnotateVideo(options);
  const stream = clientHandler.on("data", response => {
    //  console.log(response);
    //Gets annotations for video
    const annotations = response.annotationResults;
    const objects = annotations?.objectAnnotations;
    frames.push(objects);
    objects &&
      objects.forEach(object => {
        entities[object.trackId] = {
          description: object.entity.description,
          box: object.frames[0].normalizedBoundingBox,
          timeEnd:
            `${object.frames[0].timeOffset.seconds || 0}` +
            `.${(object.frames[0].timeOffset.nanos / 1e6).toFixed(0)}s`,
          timeStart:
            entities[object.trackId] != undefined
              ? entities[object.trackId].timeStart
              : `${object.frames[0].timeOffset.seconds || 0}` +
                `.${(object.frames[0].timeOffset.nanos / 1e6).toFixed(0)}s`
        };

        //   console.log(` bottom:${box.bottom}`);
      });
  });
  // [END video_streaming_object_tracking_beta]
  clientHandler.on("end", response => {
    //console.log(entities);
    entitiesArr = Object.entries(entities);
    console.log(entitiesArr);
    acceptedArr = [];

    //console.log(entiti)
    entitiesArr.forEach((item, i) => {
      if (item[1].description == "person" || item[1].description == "car")
        acceptedArr.push(item[1]);
    });
    console.log(acceptedArr, acceptedArr.length);
    fs.writeFile("video2.json", JSON.stringify(frames, null, 2), () => {});
  });
}
main(...process.argv.slice(2)).catch(console.error());
