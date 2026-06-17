const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config.json');

function getGuildConfig(guildId) {
    if (!fs.existsSync(configPath)) {
        return {};
    }
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config[guildId] || {};
    } catch (error) {
        console.error(`[Priv] Error reading config for guild ${guildId}:`, error);
        return {};
    }
}

function updateGuildConfig(guildId, updates) {
    let config = {};
    if (fs.existsSync(configPath)) {
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (error) {
            console.error(`[Priv] Error parsing config during update:`, error);
        }
    }
    
    if (!config[guildId]) {
        config[guildId] = {};
    }
    
    config[guildId] = {
        ...config[guildId],
        ...updates
    };
    
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error(`[Priv] Error writing config for guild ${guildId}:`, error);
    }
}

module.exports = {
    getGuildConfig,
    updateGuildConfig
};
