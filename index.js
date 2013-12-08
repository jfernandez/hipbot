var wobot = require('wobot');
var https = require('https');
var Hapi  = require('hapi');

var room = process.env.HIPCHAT_ROOM;
var botJid = process.env.HIPCHAT_JIB;
var botPw = process.env.HIPCHAT_PW;
var agentUrl = process.env.EI_AGENT_URL;

var bot = new wobot.Bot({
  jid: botJid,
  password: botPw
});

bot.connect();

bot.onConnect(function () {
  console.log("Connected to server");
  bot.join(room);
});

bot.onMessage("!temp", function (channel, from, message) {
  console.log("Received !temp command");
  var url = agentUrl + "?temp=1";

  https.get(url, function(res) {
    console.log("Got response: " + res.statusCode);
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
});

bot.onError(function (condition, text, stanza) {
  console.log(text);
});

// Create a server with a host and port
var port = parseInt(process.env.NODE_PORT, 10) || 8080;
var server = Hapi.createServer('localhost', 8080);

// Add the route
server.route({
  method: 'GET',
  path: '/hipchat',
  handler: function (request) {
    this.reply(request.query.message);
  }
});

// Start the server
server.start();
