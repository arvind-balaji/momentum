const cocoSsd = require("@tensorflow-models/coco-ssd");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs").promises;
const yolo = require("tfjs-yolo")(async () => {
  // const model = await cocoSsd.load();
  const model = await yolo.v3();
  const frame = await fs.readFile("image1.jpg");

  const frames = (await fs.readdir("./video1_frames"))
    .sort((a, b) => parseInt(a.split(".")[0]) - parseInt(b.split(".")[0]))
    .map((file) => "./video1_frames/" + file);

  console.log(frames);

  const detect = async (file) =>
    model.detect(
      tf.node.decodeImage(new Uint8Array(await fs.readFile(file)), 3)
    );

  // const predictions = frames.map((frame) => detect(frame));

  // console.log({ predictions });
  const predictions = await Promise.all(frames.map((frame) => detect(frame)));
  //   Promise.resolve(predictions);
  console.log(predictions);
})();

// // Load the Coco SSD model and image.
// Promise.all([cocoSsd.load(), fs.readFile("image1.jpg")])
//   .then((results) => {
//     // First result is the COCO-SSD model object.
//     const model = results[0];
//     // Second result is image buffer.
//     const imgTensor =
//     // Call detect() to run inference.
//     return model.detect(imgTensor);
//   })
//   .then((predictions) => {
//     console.log(JSON.stringify(predictions, null, 2));
//   });
