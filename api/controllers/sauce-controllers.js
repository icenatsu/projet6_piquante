const {create, allSauce, oneSauce, sauceDelete, modifSauce, sauceLike} = require('../queries/sauce-queries')
const jwt = require('jsonwebtoken');

exports.createSauce = async (req, res, next) =>{
    try{
        const sauce = await create(req);
        res.status(201).json({message: 'Sauce created'});
    }catch(e){
        res.status(400).json({error : "Sauce not created"});
        next(e);
    }
};

exports.getAllSauce = async (req, res, next) => {
    try{
        const sauces = await allSauce();
        res.status(200).json(sauces);
    }catch(e){
        res.status(400).json({e});
        next(e);
    }
};

exports.getOneSauce = async (req, res, next) => {
    try{
        const sauce = await oneSauce(req);
        res.status(200).json(sauce);
    }catch(e){
        res.status(400).json({e});
        console.log(e);
        next(e);
    }
};

exports.deleteSauce = async (req, res, next) => {
    try{
        const searchSauce = await oneSauce(req)
        const sauce = await sauceDelete(req, searchSauce);
        res.status(200).json({message : 'Sauce deleted'});
    }catch(e){
        res.status(400).json(e);
        console.log(e);
        next(e);
    }
};

exports.modifySauce = async (req, res, next) => {
    try{
        const searchSauce = await oneSauce(req);
        const modifySauce = await modifSauce(req, searchSauce);
        res.status(200).json({message : 'Sauce modify'});
    }catch(e){
        res.status(400).json({message : 'Sauce not modify'});
        console.log(e);
        next(e);
    }
};


exports.likeSauce = async (req, res, next) => {
    try{
        const searchSauce = await oneSauce(req);
        const likeSauce = await sauceLike(req, searchSauce);
        res.status(201).json({message : 'Liked'});
    }catch(e){
        res.status(400).json({message : 'Not liked'});
        console.log(e);
        next(e);
    }
};