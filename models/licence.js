'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Licence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Une licence appartient à un ou plusieurs utilisateurs (celons le nbUser)
      models.Licence.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    }
  }
  Licence.init({
    sn: DataTypes.STRING,
    nbUser: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Licence',
  });
  return Licence;
};