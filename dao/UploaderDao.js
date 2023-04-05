const SuperDao = require('./SuperDao');
const models = require('../models');

const Uploader = models.uploader;

class UploaderDao extends SuperDao {
    constructor() {
        super(Uploader);
    }
}

module.exports = UploaderDao;
