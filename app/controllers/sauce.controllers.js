const {create, allSauces, oneSauce, sauceDelete, sauceUpdate, sauceLike} = require('../queries/sauce.queries')


exports.createSauce = async (req, res, next) =>{
    try{
        const sauce = await create(req);
        sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        res.status(201).json({message: 'Sauce created', sauce : sauce});
    }catch(e){
        res.status(400).json({error : "Sauce not created"});
        next(e);
    }
};

exports.readAllSauces = async (req, res, next) => {
    try{
        const sauces = await allSauces();
        if(sauces.length === 0){
            throw `Sauces does not exist`
        }
        for (const key in sauces) {
            const fileName = sauces[key].imageUrl;
            sauces[key].imageUrl = `${req.protocol}://${req.get('host')}/images/${fileName}`;
        }
        res.status(200).json(sauces);
    
    }catch(e){
        res.status(400).json({message : e});
        console.log(e);
        next(e);
    }
};

exports.readOneSauce = async (req, res, next) => {
    try{
        const sauce = await oneSauce(req);
        if (sauce == null){
            throw `The sauce does not exist`
        }
        const fileName = sauce.imageUrl;
        sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${fileName}`;        

        res.status(200).json(sauce);
    }catch(e){
        res.status(400).json({message : e});
        next(e);
    }
};

exports.deleteSauce = async (req, res, next) => {

    try{
        const searchSauce = await oneSauce(req);
        if (searchSauce == null){
            throw `The sauce does not exist`
        }
        if((req.auth.userId != searchSauce.userId)){
            throw 'Not Authorized';
        }      
        const sauce = sauceDelete(searchSauce);
        res.status(204).send();
    }catch(e){
        res.status(401).json({message : e});
        next(e);
    }
};

exports.updateSauce = async (req, res, next) => {
    try{
        const searchSauce = await oneSauce(req);
        if (searchSauce == null){
            throw `The sauce does not exist`
        }
        if((req.auth.userId != searchSauce.userId)){
            throw 'Not Authorized';
        } 
        const updatesauce = sauceUpdate(req, searchSauce);
        res.status(200).json({message : 'Modified sauce', sauce : updatesauce});
    }catch(e){
        res.status(401).json({message : e});
        next(e);
    }
};

exports.likeSauce = async (req, res, next) => {
    try{
        let searchSauce = await oneSauce(req);
        if (searchSauce == null){
            throw `The sauce does not exist`
        }
    
        const likeSauce = await sauceLike(req, searchSauce);

        if (likeSauce === undefined){
            throw 'You can not like or dislike twice'
        }
        
        searchSauce = await oneSauce(req);
        if(searchSauce.likes === 1){
            res.status(201).json({message : 'Liked'});
        }else if (searchSauce.dislikes === 1){
            res.status(201).json({message : 'DisLiked'});
        }else{
            res.status(201).json({message : 'Without opinion'});
        }

    }catch(e){
        res.status(400).json({message : e});
        next(e);
    }
};