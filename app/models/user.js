const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            defaultScope: {
                attributes: { exclude: ['password'] },
            },
            scopes: {
                login: {
                }
            }
        })
    }

    static associate(models) {
        this.hasOne(models.Salt, {foreignKey: 'user_id', as: 'salt'});
    }
 
}

module.exports = User;
