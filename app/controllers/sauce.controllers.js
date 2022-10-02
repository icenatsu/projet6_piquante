const {create, allSauces, oneSauce, sauceDelete, sauceUpdate, sauceLike} = require('../queries/sauce.queries')


exports.createSauce = async (req, res, next) =>{
    try{
        const sauce = await create(req);
        sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        res.status(201).json({message: 'Sauce created', sauce : sauce});
    }catch(e){
        res.status(400).json({error : "Sauce not created"});
        console.log(e);
        next(e);
    }
};

exports.readAllSauces = async (req, res, next) => {
    try{
        const sauces = await allSauces();
        
        for (const key in sauces) {
            const fileName = sauces[key].imageUrl;
            sauces[key].imageUrl = `${req.protocol}://${req.get('host')}/images/${fileName}`;
        }
        res.status(200).json(sauces);
    
    }catch(e){
        res.status(400).json({message : 'error'});
        console.log(e);
        next(e);
    }
};

exports.readOneSauce = async (req, res, next) => {
    try{
        const sauce = await oneSauce(req);
        const fileName = sauce.imageUrl;
        sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${fileName}`;        

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
        if((req.auth.userId != searchSauce.userId)){
            throw 'Not Authorized';
        }      
        const sauce = sauceDelete(searchSauce);
        res.status(204).send();
    }catch(e){
        res.status(401).json({message : 'Not authorized'});
        console.log(e);
        next(e);
    }
};

exports.updateSauce = async (req, res, next) => {
    try{
        const searchSauce = await oneSauce(req);
        if((req.auth.userId != searchSauce.userId)){
            throw 'Not Authorized';
        } 
        const updatesauce = sauceUpdate(req, searchSauce);
        res.status(200).json({message : 'Sauce modified', sauce : updatesauce});
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
        res.status(400).json({message : 'error'});
        console.log(e);
        next(e);
    }
};