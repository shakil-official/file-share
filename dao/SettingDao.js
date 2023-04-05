const SuperDao = require('./SuperDao');
const models = require('../models');

const Setting = models.setting;

class SettingDao extends SuperDao {
    constructor() {
        super(Setting);
    }
}

module.exports = SettingDao;
