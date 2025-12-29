import { formatTime } from "./formatTime";
import type TelegramBot from "node-telegram-bot-api";

export const sendCachedLocationMessage = (
    chatId: number,
    bot: TelegramBot,
    lastDuration: number,
) => {
        if (lastDuration < 30 * 60) {
            bot.sendMessage(chatId, "🏃‍♂️ Narek is very close! Go meet him!");
            return;
        }

        bot.sendMessage(chatId, `🕒 Narek will arrive in ${formatTime(lastDuration)}.`);
};
