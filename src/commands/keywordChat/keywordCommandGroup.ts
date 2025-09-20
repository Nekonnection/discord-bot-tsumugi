import { PermissionsBitField } from 'discord.js';

import CustomSlashCommandBuilder from '../../utils/CustomSlashCommandBuilder.js';
import { CommandGroupInteraction } from '../base/command_base.js';

class KeywordCommandGroup extends CommandGroupInteraction {
    public command = new CustomSlashCommandBuilder()
        .setName('keyword')
        .setDescription('キーワード応答機能に関する設定を行います')
        .setCategory('キーワード応答機能')
        .setUsage('`/keyword [操作] <キーワード>`')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild);
}

export default new KeywordCommandGroup();
