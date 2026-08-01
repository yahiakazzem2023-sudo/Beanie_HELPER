const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

// نقاط مؤقتة في الذاكرة
let points = {};

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(' ');
  const command = args[0];

  // أمر !help
  if (command === '!help') {
    message.reply(`
الإعدادات ⚙️
!idstaff ID → إضافة رتبة Staff
!idhigh ID → إضافة رتبة High Staff
!idticket ID → تحديد كاتيجوري التذاكر
!idrating ID → تحديد روم التقييم

اللوحات ❎
!panel 1 → إرسال أول بانل
!panel 2 → إرسال ثاني بانل

الشكر ✏️
!rename اسم → تغيير اسم الشكر
!delete → حذف الشكر

النقاط ⭐
!points → عرض نقاطك
+point @user 10 → إضافة نقاط
-point @user 10 → خصم نقاط

الشوب 🛒
$top → أفضل الإداريين
!shop → عرض المتجر
!buy 1 → شراء المنتج رقم 1

الرسائل 💌
!dm @user الرسالة → إرسال رسالة خاصة
!dms الرسالة → إرسال الرسالة لكل الأعضاء مع منشن تلقائي
    `);
  }

  // الإعدادات ⚙️
  if (command === '!idstaff') message.reply('✅ تم إضافة رتبة Staff بالـ ID');
  if (command === '!idhigh') message.reply('✅ تم إضافة رتبة High Staff بالـ ID');
  if (command === '!idticket') message.reply('🎫 تم تحديد كاتيجوري التذاكر');
  if (command === '!idrating') message.reply('⭐ تم تحديد روم التقييم');

  // اللوحات ❎
  if (command === '!panel') {
    if (args[1] === '1') message.reply('📋 إرسال أول بانل من Dashboard');
    if (args[1] === '2') message.reply('📋 إرسال ثاني بانل');
  }

  // الشكر ✏️
  if (command === '!rename') {
    const newName = args.slice(1).join(' ');
    message.reply(`✏️ تم تغيير اسم الشكر إلى: ${newName}`);
  }
  if (command === '!delete') message.reply('🗑️ تم حذف الشكر');

  // النقاط ⭐
  if (command === '!points') {
    const userPoints = points[message.author.id] || 0;
    message.reply(`⭐ نقاطك الحالية: ${userPoints}`);
  }
  if (command === '+point') {
    const user = message.mentions.users.first();
    const amount = parseInt(args[2]);
    if (user) {
      points[user.id] = (points[user.id] || 0) + amount;
      message.reply(`✅ تمت إضافة ${amount} نقطة لـ ${user.username}`);
    }
  }
  if (command === '-point') {
    const user = message.mentions.users.first();
    const amount = parseInt(args[2]);
    if (user) {
      points[user.id] = (points[user.id] || 0) - amount;
      message.reply(`❌ تم خصم ${amount} نقطة من ${user.username}`);
    }
  }

  // الشوب 🛒
  if (command === '$top') message.reply('🏆 أفضل الإداريين:\n1- اسم\n2- اسم');
  if (command === '!shop') message.reply('🛒 المتجر:\n1- منتج رقم 1\n2- منتج رقم 2');
  if (command === '!buy') {
    const item = args[1];
    message.reply(`✅ اشتريت المنتج رقم ${item}`);
  }

  // الرسائل 💌
  if (command === '!dm') {
    const user = message.mentions.users.first();
    const msg = args.slice(2).join(' ');
    if (user) {
      user.send(`💌 رسالة من ${message.author.username}: ${msg}`);
      message.reply('📩 تم إرسال الرسالة في الخاص.');
    }
  }
  if (command === '!dms') {
    const msg = args.slice(1).join(' ');
    message.guild.members.cache.forEach(member => {
      if (!member.user.bot) {
        member.send(`📢 منشن تلقائي: ${msg}`).catch(() => {});
      }
    });
    message.reply('📩 تم إرسال الرسالة لكل الأعضاء في الخاص.');
  }
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
