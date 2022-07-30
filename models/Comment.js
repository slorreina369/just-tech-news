const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model{}

Comment.init(
    {
        id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        comment_text:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                len:[2]
            }            
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true
        },
        post_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true
        }       
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName:'comment'
    }
);

module.exports = Comment;