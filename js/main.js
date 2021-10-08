var socket = io.connect();

        $("form#chat").submit(function(e){
            e.preventDefault();
            socket.emit("enviar mensagem", $(this).find("#texto_mensagem").val(), function(){
                $("form#chat #texto_mensagem").val("");
            });
             
        });

        socket.on("atualizar mensagens", function(mensagem){
            var mensagem_formatada = $("<p />").text(mensagem);
            $("#historico_mensagens").append(mensagem_formatada);
        });

        $("form#login").submit(function(e){
            e.preventDefault();

            socket.emit("entrar", $(this).find("#apelido").val(), function(valido){
                if(valido){
                    
                }else{
                    $("#acesso_usuario").val("");
                    alert("Nome já utilizado nesta sala");
                }
            });
        });

        socket.on("atualizar usuarios", function(usuarios){
            $("#lista_usuarios").empty();
            $("#lista_usuarios").append("<option value=''>Todos</option>");
            $.each(usuarios, function(indice){
                var opcao_usuario = $("<option />").text(usuarios[indice]);
                $("#lista_usuarios").append(opcao_usuario);
            });
        });