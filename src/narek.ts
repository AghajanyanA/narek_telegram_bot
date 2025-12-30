import TelegramBot, { Location } from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { sendLocationMessage } from './utils/sendLocationMessage';
import { sendCachedLocationMessage } from './utils/sendCachedLocationMessage';

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN!;
const NAREK_USERNAME = process.env.NAREK_USERNAME!;
const DESTINATION = [
    parseFloat(process.env.DESTINATION_LNG!),
    parseFloat(process.env.DESTINATION_LAT!)
];
const GROUP_CHAT_ID = parseInt(process.env.GROUP_CHAT_ID!);

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

let narekLocation: Location | null = null;
let locationTimeout: NodeJS.Timeout | null = null;
let lastDuration: number | null = null;

function startLocationExpirationTimer() {
    if (locationTimeout) clearTimeout(locationTimeout);
    locationTimeout = setTimeout(() => {
        narekLocation = null;
        bot.sendMessage(GROUP_CHAT_ID, "⚠️ Narek's location has expired. Please ask him to share it again.");
    }, 5 * 60 * 1000);
}

bot.on('location', async (msg) => {
    const isNarek = msg.from?.username === NAREK_USERNAME    

    if (!isNarek) {
        bot.sendMessage(msg.chat.id, `❌ Only Narek can update his location. \n🥵 Please ask @${NAREK_USERNAME} to send his location.`);
        return;
    }

    narekLocation = msg.location!;
    bot.sendMessage(msg.chat.id, "✅ Narek's location updated.");
    startLocationExpirationTimer();

    if (msg.chat.type === 'private') {
        lastDuration = await sendLocationMessage(GROUP_CHAT_ID, narekLocation, bot, DESTINATION);
    }

    console.log(msg.chat.id, 'narek.ts | delete later'); // delete this line later

    lastDuration = await sendLocationMessage(msg.chat.id, narekLocation, bot, DESTINATION);
});

bot.onText(/\/whereisnarek/, async (msg) => {
    if (!narekLocation) {
        bot.sendMessage(msg.chat.id, "⚠️ Narek hasn't shared his location yet.");
        return;
    }

    if (lastDuration) {
        sendCachedLocationMessage(msg.chat.id, bot, lastDuration);
        return;
    }

    await sendLocationMessage(msg.chat.id, narekLocation, bot, DESTINATION);
});

bot.onText(/\/win/, async (msg) => {
    if (!narekLocation) {
        bot.sendMessage(msg.chat.id, "⚠️ Narek hasn't shared his location yet.");
        return;
    }

    if (lastDuration) {
        sendCachedLocationMessage(msg.chat.id, bot, lastDuration);
        return;
    }

    await sendLocationMessage(msg.chat.id, narekLocation, bot, DESTINATION);
});

bot.onText(/\/refresh/, async (msg) => {
    const isNarek = msg.from?.username === NAREK_USERNAME;

    if (!isNarek) {
        bot.sendMessage(msg.chat.id, `❌ Only Narek can refresh his location.`);
        return;
    }

    if (!narekLocation) {
        bot.sendMessage(msg.chat.id, "⚠️ You haven't shared your location yet.");
        return;
    }

    startLocationExpirationTimer();
    bot.sendMessage(msg.chat.id, "🔄 Location timer refreshed. You have another 5 minutes.");
});

bot.onText(/\/cx/, async (msg) => {
    bot.sendMessage(msg.chat.id, "🚬")
});