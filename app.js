var app = require('http').createServer(resposta)
var fs = require('fs')
var io = require('socket.io')(app)
var usuarios =[]


app.listen(3000)
console.log("Aplicação esta em execução...")

function resposta (req, res){
    var arquivo = ""
    if(req.url == "/"){
        arquivo = __dirname + '/index.html'
    }else {
        arquivo = __dirname + req.url
    }
    fs.readFile(arquivo,
        function(err, data){
            if (err){
                res.writeHead(404);
                return res.end ('Pagina ou arquivo não encontrado')
            }

            res.writeHead(200);
            res.end(data);
        }
    )
}


io.on("connection", function(socket){
    socket.on("entrar", function(apelido, callback){
        if(!(apelido in usuarios)){
            socket.apelido = apelido;
            usuarios[apelido] = socket;
    
            io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
            io.sockets.emit("atualizar mensagens", " " + pegarDataAtual() + " " + apelido + " acabou de entrar na sala");
    
            callback(true);
        }else{
            callback(false);
        }
        });
    socket.on("enviar mensagem", function(mensagem_enviada, callback){
        mensagem_enviada = " " + pegarDataAtual() + " " + socket.apelido+ ": " +  mensagem_enviada;
        io.sockets.emit("atualizar mensagens", mensagem_enviada);
        callback();
    });
    socket.on("disconnect", function(){
        delete usuarios[socket.apelido];
        io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
        io.sockets.emit("atualizar mensagens", " " + pegarDataAtual() + " " + socket.apelido + " saiu da sala");
      });
         
});

function pegarDataAtual(){
 var dataAtual = new Date();
 var hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
 var minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
 

 var dataFormatada =  hora + ":" + minuto;
 return dataFormatada;
}
