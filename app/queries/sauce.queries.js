const Sauce = require("../database/models/sauce.model");
const fs = require('fs');
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
}

exports.allSauces = () => {
    return Sauce.find({}).exec();
}

exports.oneSauce = (req) => { 
    return Sauce.findOne({_id : req.params['id']}).exec();
}

exports.sauceDelete = (data) => { 
    const imgname = data.imageUrl.split("/images")[1];

    fs.unlink(`app/images/${imgname}`, () => {
        return Sauce.deleteOne(data).exec();
    })    
}

exports.sauceUpdate = (req, data) => {
    let sauce = new Sauce({});
    
    if(req.file){
        sauce = ({
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })     
    }else{
        sauce = ({
            ...req.body
        })
    }
    Sauce.updateOne(data, sauce).exec();
}

exports.sauceLike = (req, data) => {

    const like = req.body.like;
    switch(like){

        case 1:
            if(!data.usersLiked.includes(req.body.userId)){
                Sauce.updateOne(
                    data,
                    {
                        $inc : {likes: 1},
                        $push : {usersLiked : req.body.userId},
                    }
                ).exec();
            }
        break;

        case -1:
            if(!data.usersDisliked.includes(req.body.userId)){
                Sauce.updateOne(
                    data,
                    {
                        $inc : {dislikes: 1}, 
                        $push : {usersDisliked : req.body.userId},
                    }
                ).exec();
            }
        break;

        case 0:
            if(data.usersLiked.includes(req.body.userId)){
                Sauce.updateOne(
                    data,
                    {
                        $inc : {likes: -1}, 
                        $pull : {usersLiked : req.body.userId},
                    }
                ).exec();
            }
            if(data.usersDisliked.includes(req.body.userId)){
                Sauce.updateOne(
                        data,
                        {
                            $inc : {dislikes: -1}, 
                            $pull : {usersDisliked : req.body.userId},
                        }
                ).exec();     
            }
        break;
    }  
}
