const Sauce = require("../database/models/sauce.model");
const fs = require("fs");
const { log } = require("console");

// Create Sauce in database
/**************************/
exports.create = (req) => {
  // recovery of the sauce in the request and conversion into a javascript object
  const sauceObject = JSON.parse(req.body.sauce);

  // deletion of the id of the sauce created automatically
  // and replacement by the decoded token of the user
  // building the image url
  delete sauceObject.userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.file.filename}`,
  });

  return sauce.save();
};

// Search for sauces in the database
/***********************************/
exports.allSauces = () => {
  return Sauce.find({}).exec();
};

// Search for the sauce in the database
/**************************************/
exports.oneSauce = (req) => {
  return Sauce.findOne({ _id: req.params["id"] }).exec();
};

// Deleting the sauce and its image file in the database
/*******************************************************/
exports.sauceDelete = (data) => {
  const imgname = data.imageUrl.split("/images")[1];

  fs.unlink(`app/images/${imgname}`, () => {
    return Sauce.deleteOne(data).exec();
  });
};

// Update Sauce in the database
/******************************/
exports.sauceUpdate = (req, data) => {
  let sauce = new Sauce({});
  // configure the sauce either with its image file or without
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
  // return the modified sauce after update => { new: true }
  return Sauce.findOneAndUpdate(data, sauce, { new: true }).exec();
};

// Update like Sauce in the database
/************************************/
exports.sauceLike = (req, data) => {
  // retrieving the value of like + userid
  const like = req.body.like;
  const userId = req.auth.userId;
  let update = new Object();

  switch (like) {
    case 1:
      // Adding the user's like if he has not already disliked the sauce
      update = {
        $inc: { likes: 1 },
        $push: { usersLiked: userId },
      };

      if (data.usersDisliked.includes(userId)) {
        update = {
          $inc: { likes: 1, dislikes: -1 },
          $push: { usersLiked: userId },
          $pull: { usersDisliked: userId },
        };
      }

      if (!data.usersLiked.includes(userId)) {
        // return the modified sauce after update => { new: true }
        return Sauce.findOneAndUpdate(data, update, { new: true }).exec();
      }
      break;

    case -1:
      // Adding the user's dislike if he has not already liked the sauce
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
        // return the modified sauce after update => { new: true }
        return Sauce.findOneAndUpdate(data, update, { new: true }).exec();
      }
      break;

    case 0:
      // if the user has already liked
      if (data.usersLiked.includes(userId)) {
        // return the modified sauce after update => { new: true }
        return Sauce.findOneAndUpdate(
          data,
          (update = {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
          }),
          { new: true }
        ).exec();
      }
      // if the user has already disliked
      if (data.usersDisliked.includes(userId)) {
        // return the modified sauce after update => { new: true }
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
      // returns if the user has already voted
      return "Invalid_STATUS";
  }
};
