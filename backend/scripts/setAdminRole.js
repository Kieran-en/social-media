const db = require('./config'); // your Sequelize instance
const User = require('./models/User');

async function setAdminRole(userId) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('User not found');
      return;
    }
    user.role = 'admin';
    await user.save();
    console.log(`User ${user.name} role updated to admin.`);
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
}

setAdminRole(1); // Replace 123 with user ID
