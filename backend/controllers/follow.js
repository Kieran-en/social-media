const User = require('../models/User');
const Follow = require('../models/Follow')
const { Op } = require("sequelize");

exports.followOrUnfollow = (req, res, next) => {
    const {following_user_id, followed_user_id, follow} = req.body;

    console.log("SEE THIS", followed_user_id, following_user_id)

    if (follow === 1){
        Follow.create({
            following_user_id: following_user_id,
            followed_user_id: followed_user_id
        })
          User.increment({followers: 1}, { where: {id: followed_user_id}})
          User.increment({following: 1}, { where: {id: following_user_id}})
          .then(() => res.status(200).json({message: 'You successfully followed this boy/girl!'}))
          .catch(error => res.status(500).json({error}))
        }

    else if(follow === 0){
        Follow.findOne({
            where: {
                [Op.and]: [{following_user_id : following_user_id}, {followed_user_id : followed_user_id}]
            }
        })
        .then(follow => {
            if (!follow){
                return res.status(404).json({error: 'You we\'re not following this user'})
            }
            else {
                User.increment({followers: -1}, { where: {id: followed_user_id}})
                User.increment({following: -1}, { where: {id: following_user_id}})
                Follow.destroy({
                    where: {
                        [Op.and]: [{following_user_id : following_user_id}, {followed_user_id : followed_user_id}]
                    }
                })
                .then(() => res.status(200).json({message: 'You successfully unfollowed this pikin'}))
                .catch(error => res.status(500).json({error}))
            }
        })


    }
}

exports.isUserFollowed = (req, res, next) => {
    const {following_user_id, followed_user_id} = req.query;
    console.log("FOLLLOWING", following_user_id, followed_user_id)
    Follow.count({
        where: {
            [Op.and] : [{
                following_user_id : following_user_id,
                followed_user_id: followed_user_id
            }]
        }
    })
    .then(count => res.status(200).json(count))
    .catch(error => res.status(500).json({error}))
}