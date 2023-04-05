const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Setting extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    }

    Setting.init(
        {
            download_limit: DataTypes.INTEGER,
            upload_limit: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'setting',
            underscored: true,
        },
    );
    return Setting;
};
