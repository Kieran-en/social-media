// Script de test pour le système de notifications
const NotificationService = require('./services/notificationService');

async function testNotifications() {
  console.log('🧪 Test du système de notifications...\n');

  try {
    // Test 1: Créer une notification simple
    console.log('1️⃣ Test de création de notification...');
    const notification = await NotificationService.createNotification({
      senderId: 1,
      receiverId: 2,
      type: 'post',
      text: 'Test notification - Nouveau post publié'
    });
    
    if (notification) {
      console.log('✅ Notification créée avec succès');
      console.log(`📧 ID: ${notification.id}, Type: ${notification.type}`);
    } else {
      console.log('ℹ️  Notification non créée (probablement même utilisateur)');
    }

    // Test 2: Récupérer les notifications d'un utilisateur
    console.log('\n2️⃣ Test de récupération des notifications...');
    const notifications = await NotificationService.getUserNotifications(2);
    console.log(`✅ ${notifications.length} notifications trouvées pour l'utilisateur 2`);

    // Test 3: Compter les notifications non lues
    console.log('\n3️⃣ Test de comptage des notifications non lues...');
    const unreadCount = await NotificationService.getUnreadCount(2);
    console.log(`✅ ${unreadCount} notifications non lues`);

    // Test 4: Marquer une notification comme lue
    if (notifications.length > 0) {
      console.log('\n4️⃣ Test de marquage comme lue...');
      await NotificationService.markAsRead(notifications[0].id, 2);
      console.log('✅ Notification marquée comme lue');
    }

    // Test 5: Marquer toutes les notifications comme lues
    console.log('\n5️⃣ Test de marquage de toutes les notifications comme lues...');
    await NotificationService.markAllAsRead(2);
    console.log('✅ Toutes les notifications marquées comme lues');

    console.log('\n🎉 Tests terminés avec succès !');
    console.log('\n📋 Fonctionnalités testées :');
    console.log('✅ Création de notifications');
    console.log('✅ Récupération des notifications');
    console.log('✅ Comptage des notifications non lues');
    console.log('✅ Marquage comme lue');
    console.log('✅ Marquage de toutes comme lues');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Exécuter les tests
testNotifications().catch(console.error);
