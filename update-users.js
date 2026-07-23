const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] 
});

const GUILD_ID = '1529136888013783222';

client.once('ready', async () => {
    try {
        console.log(`Zalogowano jako ${client.user.tag}!`);
        const guild = await client.guilds.fetch(GUILD_ID);
        await guild.members.fetch();

        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

        const recentMembers = guild.members.cache
            .filter(member => member.joinedTimestamp > thirtyDaysAgo && !member.user.bot)
            .map(member => ({
                username: member.user.username,
                avatar: member.user.displayAvatarURL({ extension: 'png', size: 128 })
            }));

        fs.writeFileSync('./users.json', JSON.stringify(recentMembers, null, 2));
        console.log(`Zapisano ${recentMembers.length} użytkowników do users.json`);
        
        process.exit(0);
    } catch (error) {
        console.error('Błąd podczas pobierania członków:', error);
        process.exit(1);
    }
});

client.login(process.env.DISCORD_TOKEN);
