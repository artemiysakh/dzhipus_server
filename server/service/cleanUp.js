const cron = require('node-cron')
const {User} = require('../models/models')
const Token = require('../models/token')

async function cleanInactiveAccounts() {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate()-1); // 1 дня для неактивированных аккаунтов

    // 1. Находим всех неактивированных пользователей
    const inactiveUsers = await User.find({ 
      isActivated: false,
      createdAt: { $lt: cutoff }
    }).select('_id');

    // 2. Получаем массив ID неактивных пользователей
    const inactiveUserIds = inactiveUsers.map(user => user._id);

    if (inactiveUserIds.length > 0) {
      // 3. Удаляем все токены, связанные с этими пользователями
      const tokenDeletionResult = await Token.deleteMany({ 
        user: { $in: inactiveUserIds } 
      });

      // 4. Удаляем самих пользователей
      const userDeletionResult = await User.deleteMany({ 
        _id: { $in: inactiveUserIds } 
      });

      console.log(`Cleaned ${userDeletionResult.deletedCount} inactive accounts and ${tokenDeletionResult.deletedCount} associated tokens`);
    } else {
      console.log('No inactive accounts to clean');
    }
  } catch (error) {
    console.error('Error cleaning inactive accounts:', error);
    throw error; 
  }
}
function startCleanupJobs() {
  cron.schedule('0 3 * * *', () => {
    console.log('Running cleanup jobs...');
    cleanInactiveAccounts();
  });
}

module.exports = startCleanupJobs;