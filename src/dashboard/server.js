const express = require('express');
const session = require('express-session');
const path = require('path');
const { ChannelType } = require('discord.js');
const { getGuildConfig, updateGuildConfig } = require('../utils/config');

function startDashboard(client) {
    const app = express();
    const PORT = process.env.DASHBOARD_PORT || 3000;
    const DASHBOARD_URL = process.env.DASHBOARD_URL || `http://localhost:${PORT}`;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(session({
        secret: process.env.SESSION_SECRET || 'priv-bot-dashboard-default-secret-key-123',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            maxAge: 60000 * 60 * 24
        }
    }));

    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/api/auth/login', (req, res) => {
        const redirectUri = encodeURIComponent(`${DASHBOARD_URL}/api/auth/callback`);
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=identify+guilds`);
    });
    app.get('/api/auth/callback', async (req, res) => {
        const { code } = req.query;
        if (!code) {
            return res.redirect('/index.html?error=no_code_provided');
        }

        try {
            const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: process.env.DISCORD_CLIENT_ID,
                    client_secret: process.env.DISCORD_CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: `${DASHBOARD_URL}/api/auth/callback`
                })
            });

            if (!tokenResponse.ok) {
                const errText = await tokenResponse.text();
                throw new Error(`Failed to exchange token: ${errText}`);
            }

            const tokens = await tokenResponse.json();
            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`
                }
            });
            const user = await userResponse.json();
            const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`
                }
            });
            const guilds = await guildsResponse.json();
            req.session.user = {
                id: user.id,
                username: user.username,
                discriminator: user.discriminator,
                avatar: user.avatar
            };

            req.session.guilds = Array.isArray(guilds)
                ? guilds.filter(g => (BigInt(g.permissions) & 0x8n) === 0x8n || (BigInt(g.permissions) & 0x20n) === 0x20n)
                : [];

            res.redirect('/dashboard.html');
        } catch (error) {
            console.error('[Dashboard] OAuth2 Callback Error:', error);
            res.redirect('/index.html?error=auth_failed');
        }
    });

    app.get('/api/auth/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('[Dashboard] Logout error:', err);
            }
            res.redirect('/index.html');
        });
    });

    app.get('/api/user', (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json({
            user: req.session.user,
            clientId: process.env.DISCORD_CLIENT_ID
        });
    });

    app.get('/api/stats', (req, res) => {
        res.json({
            guildsCount: client.guilds.cache.size,
            usersCount: client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0),
            latency: Math.round(client.ws.ping),
            uptime: client.uptime
        });
    });

    app.get('/api/guilds', (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const botGuildIds = Array.from(client.guilds.cache.keys());
        const userGuildsWithBot = req.session.guilds.map(guild => ({
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            botInGuild: botGuildIds.includes(guild.id)
        }));

        res.json({ guilds: userGuildsWithBot });
    });

    app.get('/api/guilds/:guildId/config', (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { guildId } = req.params;
        const userHasPermission = req.session.guilds.some(g => g.id === guildId);
        if (!userHasPermission) {
            return res.status(403).json({ error: '403: You are not an admin of this server!' });
        }

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Bot is not in this guild' });
        }

        const channels = guild.channels.cache
            .filter(c => c.type === ChannelType.GuildText)
            .map(c => ({ id: c.id, name: c.name }));

        const roles = guild.roles.cache
            .filter(r => r.id !== guild.id)
            .map(r => ({ id: r.id, name: r.name, color: r.hexColor }));

        const config = getGuildConfig(guildId);

        res.json({
            config,
            channels,
            roles
        });
    });

    app.post('/api/guilds/:guildId/config', (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { guildId } = req.params;
        const {
            welcomeModule,
            welcomeChannelId,
            whitelistModule,
            whitelistRoleId,
            whitelistChannelId
        } = req.body;

        const userHasPermission = req.session.guilds.some(g => g.id === guildId);
        if (!userHasPermission) {
            return res.status(403).json({ error: 'Forbidden: You do not administer this server' });
        }

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Bot is not in this guild' });
        }

        updateGuildConfig(guildId, {
            welcomeModule: welcomeModule === true || welcomeModule === 'true',
            welcomeChannelId: welcomeChannelId || null,
            whitelistModule: whitelistModule === true || whitelistModule === 'true',
            whitelistRoleId: whitelistRoleId || null,
            whitelistChannelId: whitelistChannelId || null
        });

        res.json({ success: true, message: 'Settings saved successfully' });
    });

    app.listen(PORT, () => {
        console.log(`[Priv] Dashboard listening on port ${PORT} (${DASHBOARD_URL})`);
    });
}

module.exports = { startDashboard };
