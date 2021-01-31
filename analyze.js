const fs = require("fs").promises;

const { writeFileSync } = require("fs");
const { uniq, clamp } = require("lodash");
const { createCanvas, loadImage } = require("canvas");

(async () => {
  const data = JSON.parse(await fs.readFile("./video7.json", "utf-8"));
  const cleanedData = data.flatMap((frameObjects, i) =>
    frameObjects.map(frameObject => ({ ...frameObject, frameIndex: i }))
  );

  const allFrames = data.map((frameObjects, i) =>
    frameObjects.map(frameObject => ({ ...frameObject, frameIndex: i }))
  );

  const trackIds = uniq(
    allFrames.flatMap(items => items.map(item => item.trackId))
  );

  const allObjects = trackIds.map(id =>
    cleanedData.filter(({ trackId }) => trackId == id)
  );

  let dataFrames = [...Array(allFrames.length)].map((_, idx) => {
    const entities = cleanedData.filter(({ frameIndex }) => frameIndex == idx);

    const maxWeight = 1;

    let points = entities.map(item => {
      const box = item.frames[0].normalizedBoundingBox;
      const x = (box.left + box.right) / 2;
      const y = (box.top + box.bottom) / 2;
      return {
        x,
        y,
        weight: maxWeight * 1,
        id: item.trackId,
        classification: item.entity.description,
        type: "current"
      };
    });

    entities.forEach(item => {
      const id = item.trackId;
      const history = cleanedData.filter(({ trackId }) => trackId == id);

      const anchor = history.findIndex(item => item.frameIndex == idx);
      const startIdx = clamp(anchor - 5, 0, history.length - 1);
      const endIdx = clamp(anchor + 5, 0, history.length - 1);

      const startBox = history[startIdx].frames[0].normalizedBoundingBox;
      const endBox = history[endIdx].frames[0].normalizedBoundingBox;

      const startP = {
        x: (startBox.left + startBox.right) / 2,
        y: (startBox.top + startBox.bottom) / 2,
        id: history[startIdx].trackId,
        classification: history[startIdx].entity.description,
        type: "start",
        weight: maxWeight * 0.5
      };

      const endP = {
        x: (endBox.left + endBox.right) / 2,
        y: (endBox.top + endBox.bottom) / 2,
        id: history[startIdx].trackId,
        classification: history[startIdx].entity.description,
        type: "end",
        weight: maxWeight * 0.5
      };

      points = [...points, startP, endP];
    });

    return points;
  });

  dataFrames = dataFrames.map(data =>
    data.filter(({ classification }) =>
      ["car", "van", "person", "bus"].includes(classification)
    )
  );

  await fs.writeFile(
    "./video7_analyzed.json",
    JSON.stringify(dataFrames, null, 2)
  );
  const w = 1920,
    h = 1080;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");

  // allFrames.forEach(async (items, frameIndex) => {
  //   const canvas = createCanvas(w, h, "png");
  //   const ctx = canvas.getContext("2d");
  //
  //   const img = await loadImage(`./frames/${frameIndex + 1}.png`);
  //
  //   ctx.drawImage(img, 0, 0, w, h);
  //
  //   // // Write "Awesome!"
  //   // ctx.font = "30px Impact";
  //   // // ctx.rotate(0.1);
  //   // ctx.fillText("Awesome!", 50, 100);
  //
  //   items.forEach((item, i) => {
  //     const box = item.frames[0].normalizedBoundingBox;
  //
  //     const x = box.left * w;
  //     const y = box.top * h;
  //
  //     const boxH = (box.bottom - box.top) * h;
  //     const boxW = (box.right - box.left) * w;
  //
  //     ctx.font = "bold 25px courier";
  //     ctx.fillStyle = "red";
  //     ctx.fillText(`ID:   ${item.trackId}`, x, y - 12);
  //     ctx.fillText(`TYPE: ${item.entity.description}`, x, y - 35);
  //
  //     ctx.beginPath();
  //     ctx.lineWidth = "5";
  //     ctx.strokeStyle = "red";
  //     ctx.rect(x, y, boxW, boxH);
  //     // console.log({ x, y, boxW, boxH });
  //     ctx.stroke();
  //   });
  //   writeFileSync(`./boxes/${frameIndex}.png`, canvas.toBuffer("image/png"));
  // });

  scrubber = 0.1;
  entitiesData = [];
  matchingData = [];

  randomfunction = entitiesData => {
    entitiesData.forEach(item => {
      if (item.start < scrubber < item.end) {
        matchingData.push(item);
      }
    });
    return matchingData;
  };
})();
