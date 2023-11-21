const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Mas Bot On');
});

client.on("message", async (msg) => {
    const text = msg.body.toLowerCase() || "";
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    if (text.includes(".tagall")) {
      const pengirim = await msg.getContact();
      const anu = text.slice(8);
      let pesan = `tagall form @${pengirim.id.user} \npesan : ${anu}`;
  
      let mentions = [];
      for (let participant of chat.participants) {
        const contactID = await client.getContactById(participant.id._serialized);
        mentions.push(contactID);
        console.log(contactID);
      }
      await chat.sendMessage(pesan, { mentions });
      console.log(contact.id.user, text);
    }
    if (text.startsWith(".s") && msg.hasMedia) {
      if (msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        const media1 = await quotedMsg.downloadMedia();
        client.sendMessage(msg.from, media1, { sendMediaAsSticker: true });
      } else {
        const media = await msg.downloadMedia();
        client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
      }
    }
    if (text === "Halo") {
      await chat.sendMessage(`Hai @${contact.id.user}`, {
        mentions: [contact],
      });
      console.log(contact.id.user, text);
    }
    if (text === ".help") {
      await chat.sendMessage(
        `Halo @${contact.id.user} Command List dari *Mas Bot*
  *.help*      : Menampilkan Command List
  *.tagall*    : Menandai semua member
  *.S*         : Membuat sticker
  *.groupinfo* : Info Group
  `,
        { mentions: [contact] }
      );
      console.log(contact.id.user, text);
    }
    if (msg.body.startsWith(".desc ")) {
      // Change the group description
      if (chat.isGroup) {
        let newDescription = msg.body.slice(6);
        chat.setDescription(newDescription);no
      } else {
        msg.reply("Perintah ini hanya berlaku di group");
      }
    }
    if (msg.body === ".groupinfo") {
      if (chat.isGroup) {
        msg.reply(`
                  *Group Info*
                  Nama: ${chat.name}
                  Deskripsi: ${chat.description}
                  Dibuat pada: ${chat.createdAt.toString()}
                  Jumlah Peserta: ${chat.participants.length}
              `);
      } else {
        msg.reply("Perintah ini hanya berlaku di group");
      }
    }
    if (msg.body.startsWith(".subject ")) {
      // Change the group subject
      let chat = await msg.getChat();
      if (chat.isGroup) {
        let newSubject = msg.body.slice(9);
        chat.setSubject(newSubject);
      } else {
        msg.reply("This command can only be used in a group!");
      }
    }
    if (msg.body.startsWith(".join ")) {
      const inviteCode = msg.body.split(" ")[1];
      try {
        await client.acceptInvite(inviteCode);
        msg.reply("Joined the group!");
      } catch (e) {
        msg.reply("That invite code seems to be invalid.");
      }
    }
    if (msg.body === ".leave") {
      // Leave the group
      let chat = await msg.getChat();
      if (chat.isGroup) {
        chat.leave();
      } else {
        msg.reply("This command can only be used in a group!");
      }
    }
  });
  

client.initialize();


