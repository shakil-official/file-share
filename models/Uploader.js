const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Uploader extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    }

    Uploader.init(
        {
            url: DataTypes.STRING,
            public_key: DataTypes.STRING,
            private_key: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'uploader',
            underscored: true,
        },
    );
    return Uploader;
};
