const {
  create,
  allSauces,
  oneSauce,
  sauceDelete,
  sauceUpdate,
  sauceLike,
} = require("../queries/sauce.queries");

// Create Sauce
/**************/
exports.createSauce = async (req, res, next) => {
  try {
    // create sauce
    const sauce = await create(req);
    // constructing the sauce image file url
    sauce.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    // return of the sauce created
    res
      .status(201)
      .json(
        { message: "Sauce created", sauce: sauce },
        hateoasLinks(req, sauce._id)
      );
  } catch (e) {
    res.status(400).json({ error: "Sauce not created" });
    next(e);
  }
};

// Read All Sauces
/*****************/
exports.readAllSauces = async (req, res, next) => {
  try {
    // looking for sauces
    let sauces = await allSauces();

    // rebuild image file url + hateoslinks for each sauce
    let sauceAndLinks = [];
    sauces.forEach((element) => {
      const fileName = element.imageUrl;

      element.imageUrl = `${req.protocol}://${req.get(
        "host"
      )}/images/${fileName}`;
      element = { ...element._doc, links: [] };
      element.links = hateoasLinks(req, element._id);
      sauceAndLinks.push(element);

      return sauceAndLinks;
    });

    // returns from each sauce + hatoaslink
    res.status(200).json(sauceAndLinks);
  } catch (e) {
    res.status(400).json({ message: "error" });
    next(e);
  }
};

// Read One Sauce
/****************/
exports.readOneSauce = async (req, res, next) => {
  try {
    // looking for the sauce
    const sauce = await oneSauce(req);
    if (sauce === null) {
      throw `The sauce does not exist`;
    }
    // rebuild image file url
    const fileName = sauce.imageUrl;
    sauce.imageUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    //returns sauce + hatoaslink
    res.status(200).json(sauce, hateoasLinks(req, sauce._id));
  } catch (e) {
    res.status(400).json({ message: e });
    next(e);
  }
};

// Delete Sauce
/***************/
exports.deleteSauce = async (req, res, next) => {
  try {
    // looking for the sauce
    const searchSauce = await oneSauce(req);
    if (searchSauce === null) {
      throw `The sauce does not exist`;
    }
    // authentication verification
    if (req.auth.userId != searchSauce.userId) {
      throw "Not Authorized";
    }
    // removal of the sauce and return
    const sauce = sauceDelete(searchSauce);
    res.status(204).send();
  } catch (e) {
    res.status(401).json({ message: e });
    next(e);
  }
};

// Update Sauce
/**************/
exports.updateSauce = async (req, res, next) => {
  try {
    // looking for the sauce
    let searchSauce = await oneSauce(req);
    if (searchSauce == null) {
      throw `The sauce does not exist`;
    }
    // authentication verification
    if (req.auth.userId != searchSauce.userId) {
      throw "Not Authorized";
    }
    // update sauce
    const updatesauce = await sauceUpdate(req, searchSauce);
    // returns modified sauce + hatoaslink
    res
      .status(200)
      .json(
        { message: "Modified sauce", sauce: updatesauce },
        hateoasLinks(req, searchSauce._id)
      );
  } catch (e) {
    res.status(401).json({ message: e });
    next(e);
  }
};

// Like Sauce
/************/
exports.likeSauce = async (req, res, next) => {
  try {
    // looking for the sauce
    let searchSauce = await oneSauce(req);
    if (searchSauce == null) {
      throw `The sauce does not exist`;
    }
    // sauce liked
    const sauceliked = await sauceLike(req, searchSauce);
    if (sauceliked === undefined) {
      throw "You can not like or dislike twice";
    }
    if (sauceliked === "Invalid_STATUS") {
      throw "Invalid Status !";
    }
    // return of the liked sauce
    res.status(201).json({ sauce: sauceliked });
  } catch (e) {
    res.status(400).json({ message: e });
    next(e);
  }
};

// Hateos Links
/**************/
function hateoasLinks(req, id) {
  const baseUrl = req.protocol + "://" + req.get("host");

  return [
    {
      rel: "readAllSauces",
      method: "GET",
      href: baseUrl + "/api/sauces",
    },
    {
      rel: "createSauce",
      method: "POST",
      title: "Create Sauce",
      href: baseUrl + "/api/sauces",
    },
    {
      rel: "readOneSauce",
      method: "GET",
      href: baseUrl + "/api/sauces/" + id,
    },
    {
      rel: "updateSauce",
      method: "PUT",
      title: "Modify Sauce",
      href: baseUrl + "/api/sauces/" + id,
    },
    {
      rel: "deleteSauce",
      method: "DELETE",
      title: "Delete Sauce",
      href: baseUrl + "/api/sauces/" + id,
    },
    {
      rel: "likeSauce",
      method: "POST",
      title: "Like or Dislike Sauce",
      href: baseUrl + "/api/sauces/" + id + "/like",
    },
  ];
}
