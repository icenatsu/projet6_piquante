const {
  create,
  allSauces,
  oneSauce,
  sauceDelete,
  sauceUpdate,
  sauceLike,
} = require("../queries/sauce.queries");

exports.createSauce = async (req, res, next) => {
  try {
    const sauce = await create(req);
    sauce.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
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

exports.readAllSauces = async (req, res, next) => {
  try {
    let sauces = await allSauces();

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

    res.status(200).json(sauceAndLinks);
  } catch (e) {
    res.status(400).json({ message: "error" });
    next(e);
  }
};

exports.readOneSauce = async (req, res, next) => {
  try {
    const sauce = await oneSauce(req);

    if (sauce === null) {
      throw `The sauce does not exist`;
    }
    const fileName = sauce.imageUrl;
    sauce.imageUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    res.status(200).json(sauce, hateoasLinks(req, sauce._id));
  } catch (e) {
    res.status(400).json({ message: e });
    next(e);
  }
};

exports.deleteSauce = async (req, res, next) => {
  try {
    const searchSauce = await oneSauce(req);
    if (searchSauce === null) {
      throw `The sauce does not exist`;
    }
    if (req.auth.userId != searchSauce.userId) {
      throw "Not Authorized";
    }
    const sauce = sauceDelete(searchSauce);
    res.status(204).send();
  } catch (e) {
    res.status(401).json({ message: e });
    next(e);
  }
};

exports.updateSauce = async (req, res, next) => {
  try {
    let searchSauce = await oneSauce(req);
    if (searchSauce == null) {
      throw `The sauce does not exist`;
    }

    if (req.auth.userId != searchSauce.userId) {
      throw "Not Authorized";
    }

    const updatesauce = await sauceUpdate(req, searchSauce);

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

exports.likeSauce = async (req, res, next) => {
  try {
    let searchSauce = await oneSauce(req);
    if (searchSauce == null) {
      throw `The sauce does not exist`;
    }

    const sauceliked = await sauceLike(req, searchSauce);

    if (sauceliked === undefined) {
      throw "You can not like or dislike twice";
    }

    if (sauceliked === "Invalid_STATUS") {
      throw "Invalid Status !";
    }

    res.status(201).json({ sauce: sauceliked });
  } catch (e) {
    res.status(400).json({ message: e });
    next(e);
  }
};

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
