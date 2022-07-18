'user strict'

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            required: true
        },
        description: {
            type: DataTypes.TEXT,
            required: true
        },
        price: {
            type: DataTypes.FLOAT,
            required: true
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        imageUrl: {
            type: DataTypes.STRING
        }
    }, {
        paranoid: true
    });
    return Product;
};
