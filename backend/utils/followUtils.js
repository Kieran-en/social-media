// utils/followUtils.js

const Follow = require('../models/Follow'); // adjust path if needed

/**
 * Returns an array of user IDs who follow the given userId.
 * @param {number} userId - The ID of the user whose followers you want to fetch.
 * @returns {Promise<number[]>} - An array of follower user IDs.
 */
async function getFollowers(userId) {
  try {
    const follows = await Follow.findAll({
      where: { followingId: userId },
      attributes: ['followerId']
    });

    return follows.map(f => f.followerId);
  } catch (error) {
    console.error('getFollowers error:', error);
    return [];
  }
}

module.exports = { getFollowers };
