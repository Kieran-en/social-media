const db = require('../config');

(async () => {
  try {
    const [indexes] = await db.query('SHOW INDEXES FROM Users;');

    for (const idx of indexes) {
      if ((idx.Column_name === 'name' || idx.Column_name === 'email') && idx.Key_name !== 'PRIMARY') {
        console.log(`Dropping duplicate index: ${idx.Key_name}`);
        await db.query(`ALTER TABLE Users DROP INDEX \`${idx.Key_name}\`;`);
      }
    }

    console.log('Duplicate indexes cleaned up!');
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning indexes:', err);
    process.exit(1);
  }
})();
