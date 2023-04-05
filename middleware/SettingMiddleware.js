const SettingDao = require('./../dao/SettingDao');
const IpUseDao = require("../dao/IpUseDao");
const UploaderDao = require('../dao/UploaderDao')
const path = require("path");


// Setting object - Module scaffolding
const setting = {};

const settingDao = new SettingDao();
const ipUseDao = new IpUseDao();
const uploaderDao = new UploaderDao();


setting.checkUploadLimit = async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    req.ip_address = ip;

    // get default limit from settings
    let limitData = await settingDao.findAll();

    if (limitData.length === 0) {
        return res.status(200).send({
            message: "No available limit !! Please try later."
        });
    }

    const defaultLimit = limitData[0].upload_limit;

    let ipAddressFind = await ipUseDao.findOneByWhere({ip_address: ip})

    if (ipAddressFind === null) {
        await ipUseDao.create({ip_address: ip, upload_limit: 0, download_limit: 0})
    } else if (defaultLimit <= ipAddressFind.upload_limit) {
        return res.status(422).send({
            message: "Please try later. Your today's upload limit is finished",
        });
    }

    // Call the next middleware function in the chain
    next();
}

setting.checkDownloadLimit = async (req, res, next) => {
    // Call the next middleware function in the chain

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    req.ip_address = ip;

    // get default limit from settings
    let limitData = await settingDao.findAll();

    if (limitData.length === 0) {
        return res.status(200).send({
            message: "No available limit !! Please try later."
        });
    }

    const defaultLimit = limitData[0].upload_limit;

    let ipAddressFind = await ipUseDao.findOneByWhere({ip_address: ip})

    if (ipAddressFind === null) {
        await ipUseDao.create({ip_address: ip, upload_limit: 0, download_limit: 0})
    } else if (defaultLimit <= ipAddressFind.download_limit) {
        return res.status(422).send({
            message: "Please try later. Your today's download limit is finished",
        });
    }

    // Call the next middleware function in the chain
    next();
}

setting.checkPublicKey = async (req, res, next) => {


    let publicKey = await uploaderDao.findOneByWhere({public_key: req.params.publicKey})

    if (null === publicKey) {
        return res.status(422).send({
            message: "Key is invalid",
        });
    }

    req.file_url = publicKey.url;

    next();

}

setting.checkPrivateKey = async (req, res, next) => {

    let privateKey = await uploaderDao.findOneByWhere({private_key: req.params.privateKey})

    if (null === privateKey) {
        return res.status(422).send({
            message: "Key is invalid",
        });
    }

    req.file_url = privateKey.url;

    next();
}


// Export the setting
module.exports = setting;