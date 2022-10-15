const Sauce = require("../database/models/sauce.model");
const fs = require("fs");
const { log } = require("console");

exports.create = (req) => {
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject.userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.file.filename}`,
  });

  return sauce.save();
};

exports.allSauces = () => {
  return Sauce.find({}).exec();
};

exports.oneSauce = (req) => {
  return Sauce.findOne({ _id: req.params["id"] }).exec();
};

exports.sauceDelete = (data) => {
  const imgname = data.imageUrl.split("/images")[1];

  fs.unlink(`app/images/${imgname}`, () => {
    return Sauce.deleteOne(data).exec();
  });
};

exports.sauceUpdate = (req, data) => {
  let sauce = new Sauce({});

  if (req.file) {
    sauce = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
  } else {
    sauce = {
      ...req.body,
    };
  }
  return Sauce.findOneAndUpdate(data, sauce, { new: true }).exec();
};

exports.sauceLike = (req, data) => {
  const like = req.body.like;
  const userId = req.auth.userId;
  let update = new Object();

  switch (like) {
    case 1:
      console.log("case 1");
      update = {
        $inc: { likes: 1 },
        $push: { usersLiked: userId },
      };

      if (data.usersDisliked.includes(userId)) {
        console.log("case 1 - [Dislike at userid]");
        update = {
          $inc: { likes: 1, dislikes: -1 },
          $push: { usersLiked: userId },
          $pull: { usersDisliked: userId },
        };
      }

      if (!data.usersLiked.includes(userId)) {
        console.log("case 1 - [like not userid]");
        return Sauce.findOneAndUpdate(data, update, { new: true }).exec();
      }
      break;

    case -1:
      update = {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: userId },
      };

      if (data.usersLiked.includes(userId)) {
        update = {
          $inc: { likes: -1, dislikes: 1 },
          $push: { usersDisliked: userId },
          $pull: { usersLiked: userId },
        };
      }

      if (!data.usersDisliked.includes(userId)) {
        return Sauce.findOneAndUpdate(data, update, { new: true }).exec();
      }
      break;

    case 0:
      if (data.usersLiked.includes(userId)) {
        return Sauce.findOneAndUpdate(
          data,
          (update = {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
          }),
          { new: true }
        ).exec();
      }
      if (data.usersDisliked.includes(userId)) {
        return Sauce.findOneAndUpdate(
          data,
          (update = {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId },
          }),
          { new: true }
        ).exec();
      }
      break;

    default:
      return "Invalid_STATUS";
  }
};
