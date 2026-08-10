const User = require('../models/User')

function todayStr() {
    return new Date().toISOString().slice(0, 10)
}

// Incrémente la série de jours actifs de l'utilisateur (streak d'apprentissage)
async function bumpStreak(userId) {
    const user = await User.findById(userId)
    if (!user) return

    const today = todayStr()
    if (user.lastActiveDate === today) return

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    user.streakDays = user.lastActiveDate === yesterday ? user.streakDays + 1 : 1
    user.lastActiveDate = today
    await user.save()
}

module.exports = { bumpStreak }
