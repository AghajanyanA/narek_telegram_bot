import { Location } from "node-telegram-bot-api";
import { formatTime } from "./formatTime";
import { getTravelTime } from "../playwright/getTravelTime";
import type TelegramBot from "node-telegram-bot-api";

export const sendLocationMessage = async (
    chatId: number,
    narekLocation: Location,
    bot: TelegramBot,
    destination: number[]
) => {
    const origin = [narekLocation.longitude, narekLocation.latitude];
    try {
        const duration = await getTravelTime(origin, destination);

        if (duration < 30 * 60) {
            bot.sendMessage(chatId, "🏃‍♂️ Narek is very close! Go meet him!");
            return duration;
        }

        bot.sendMessage(chatId, `🕒 Narek will arrive in ${formatTime(duration)}.`);

        return duration;
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "🚨 Error occurred, try again later.");
    }
};
