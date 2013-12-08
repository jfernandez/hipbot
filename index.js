var wobot    = require('wobot');
var https    = require('https');
var Hapi     = require('hapi');
var ntwitter = require('ntwitter');

var room = process.env.HIPCHAT_ROOM;
var botJid = process.env.HIPCHAT_JIB;
var botPw = process.env.HIPCHAT_PW;
var agentUrl = process.env.EI_AGENT_URL;

var twit = new ntwitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.TOKEN_KEY,
  access_token_secret: process.env.TOKEN_SECRET
});

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
  console.log("Sending GET: " + url);

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
    bot.message(room, request.query.message);

    twit.updateStatus(message, function (data) {
      console.log("Sent to twitter");
    });
  }
});

// Start the server
server.start();
