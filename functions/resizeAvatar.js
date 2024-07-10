// npm modules
const Jimp = require("jimp");

const resizeAvatar = async (inputPath, outputPath) => {
  try {
    const image = await Jimp.read(inputPath);
    await image.resize(250, 250).quality(60).writeAsync(outputPath);
  } catch (error) {
    console.log(error);
  }
};

module.exports = resizeAvatar;
