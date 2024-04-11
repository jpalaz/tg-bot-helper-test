const { Telegraf } = require("telegraf")
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN);
const adminId = new Telegraf(process.env.ADMIN_ID);

const messages = {
  "knihi": "Вітаю! Рады, што вы вырашылі далучыцца да нашай \"Кніжнай ініцыятывы\". Паўдзельнічаць у ёй вельмі проста."
    + "\n1. Даслаць у гэты чат фота вокладцы і зместу!\n2. Дачакацца адказу 😳😅",
  "danat": "Кнопка данат.\
      Дзякуй, што вырашылі падтрымаць нас! Вашыя ахвяранні пойдуць на падтрымку ініцыятывы з кнігамі! 😳🤓\
      Па нумару карткі Беларусбанк:\
      9112 3800 2141 8894\
      10/27\
      IBAN:   BY94AKBB30140014619630070000",
  "suviaz": "Вітаю! Напішыце сваю прапанову і хутка мы адкажам! А пакуль што можаце націснуць іншыя кнопкі 😳😏",
};

async function forwardToAdmin(ctx) {
  console.log("forward message to admin")
  await ctx.forwardMessage(adminId)
  await bot.telegram.sendMessage(adminId, "Рабіце адказ праз гэтае паведамленне\n\@" + ctx.update?.message?.from.id)
}

Object.keys(messages).forEach(function(command) {
  console.log(`Setup '${command}'' command`);
  bot.command(command, async (ctx)=> {
    console.log("Received local '${command}'' command")
    await ctx.reply(messages[command])
    await forwardToAdmin(ctx);
  })
});

bot.on(message(), async (ctx) => {
  
  if (ctx.update?.message?.reply_to_message != null  && ("" + ctx.update?.message?.from?.id) === adminId) {
    const originalMessage = ctx.update.message.reply_to_message
    const startIndex = originalMessage.text.indexOf("@")
    const replyUserId = originalMessage.text.substring(startIndex + 1)
    console.log("Admin replies to user: " + replyUserId)
    if (ctx.update?.message.text != null) {
      await bot.telegram.sendMessage(replyUserId, ctx.update?.message.text)
    } else {
      await bot.telegram.sendSticker(replyUserId, ctx.update?.message.sticker.file_id)
    }
  } else if ("" + ctx.update?.message?.from.id !== adminId) {
    await forwardToAdmin(ctx)
  }
})

exports.handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
}
