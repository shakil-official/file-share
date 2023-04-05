const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class IpAddress extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    }

    IpAddress.init(
        {
            ip_address: DataTypes.STRING,
            download_limit: DataTypes.INTEGER,
            upload_limit: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ip_uses',
            underscored: true,
        },
    );
    return IpAddress;
};
