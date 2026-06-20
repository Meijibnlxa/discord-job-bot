const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const CHANNEL_ID = '1487823129836523710';

client.once('ready', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // ไม่ตอบ bot ด้วยกัน
  if (message.author.bot) return;

  // เฉพาะ channel ที่กำหนด
  if (message.channelId !== CHANNEL_ID) return;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: message.content,
        username: message.author.username,
        author: { username: message.author.username },
        messageId: message.id,
        channelId: message.channelId,
      }),
    });

    const data = await res.json();

    // ส่ง reply กลับ Discord จาก n8n response
    if (data.message) {
      await message.reply(data.message);
    }
  } catch (err) {
    console.error('Error calling n8n webhook:', err);
    await message.reply('❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
