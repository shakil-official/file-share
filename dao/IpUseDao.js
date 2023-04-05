const SuperDao = require('./SuperDao');
const models = require('../models');

const IpUse = models.ip_uses;

class IpUseDao extends SuperDao {
    constructor() {
        super(IpUse);
    }
}

module.exports = IpUseDao;
