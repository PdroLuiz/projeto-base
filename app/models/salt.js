const { Model, DataTypes } = require('sequelize');

class Salt extends Model {

    static init(sequelize) {
        super.init({
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                  model: 'users',
                  key: 'id',
                  OnUpdate: 'CASCADE',
                  OnDelte: 'CASCADE',
                }
              },
              salt: {
                type: DataTypes.STRING,
                allowNull: false,
              } 
        }, {
            sequelize,
            tableName: 'salt',
        })
    }

}

module.exports = Salt;