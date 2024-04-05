const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

const messages = {
  "knihi": "Вітаю! Рады, што вы вырашылі далучыцца да нашай \"Кніжнай ініцыятывы\". Паўдзельнічаць у ёй вельмі проста."
    + "\n1. Даслаць у гэты чат фота вокладцы і зместу!\n2. Дачакацца адказу 😳😅",
  "danat": "Каманда, што піша пра кнігі",
  "suviaz": "Вітаю! Напішыце сваю прапанову і хутка мы адкажам! А пакуль што можаце націснуць іншыя кнопкі 😳😏",
};

Object.keys(messages).forEach(function(command) {
  console.log(`Received '${command}'' command`);
  bot.command(command, async (ctx) => await ctx.reply(messages[command]));
});

exports.handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
}
