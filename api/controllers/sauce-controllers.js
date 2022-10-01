const {create, allSauce, oneSauce, sauceDelete, modifSauce, sauceLike} = require('../queries/sauce-queries')


exports.createSauce = async (req, res, next) =>{
    try{
        const sauce = create(req);
        res.status(201).json({message: 'Sauce created'});
    }catch(e){
        res.status(400).json({error : "Sauce not created"});
        console.log(e);
        next(e);
    }
};

exports.getAllSauce = async (req, res, next) => {
    try{
        const sauces = await allSauce();
        res.status(200).json(sauces);
    }catch(e){
        res.status(400).json({message : 'error'});
        console.log(e);
        next(e);
    }
};

exports.getOneSauce = async (req, res, next) => {
    try{
        const sauce = await oneSauce(req);
        res.status(200).json(sauce);
    }catch(e){
        res.status(400).json({message : 'error'});
        console.log(e);
        next(e);
    }
};

exports.deleteSauce = async (req, res, next) => {

    try{
        const searchSauce = await oneSauce(req);
        if((req.auth.userId.userId != searchSauce.userId)){
            throw 'Not Authorized';
        }      
        const sauce = sauceDelete(searchSauce);
        res.status(200).json({message : 'Sauce deleted'});
    }catch(e){
        res.status(401).json({message : 'Not authorized'});
        console.log(e);
        next(e);
    }
};

exports.modifySauce = async (req, res, next) => {
    try{
        const searchSauce = await oneSauce(req);
        if((req.auth.userId.userId != searchSauce.userId)){
            throw 'Not Authorized';
        } 
        const modifySauce = modifSauce(req, searchSauce);
        res.status(200).json({message : 'Sauce modified'});
    }catch(e){
        res.status(401).json({message : 'Not authorized'});
        console.log(e);
        next(e);
    }
};

exports.likeSauce = async (req, res, next) => {
    try{
        const searchSauce = await oneSauce(req);
        const likeSauce = sauceLike(req, searchSauce);
        res.status(201).json({message : 'Liked'});
    }catch(e){
        res.status(400).json({message : 'Not liked'});
        console.log(e);
        next(e);
    }
};