$(document).ready(function(){
	
	var usuarioLogado;
	var PATH = "../../";
	
	//Função que chama a Servlet validação da sessão do usuário
	verificaUsuario = function(){
		$.ajax({
			type: "POST",
			url: PATH + "ValidaSessao",
			data: "p=1",
			success: function (usuario) {
				if (usuario.login!=null){
					usuarioLogado = new Object();
					usuarioLogado.login = usuario.login;
					usuarioLogado.email = usuario.email;
					usuarioLogado.nome = usuario.nome;
					usuarioLogado.nascimento = usuario.nascimento;
					carregaPagina();
				} else {
					sair();
				}	
			},
			error: function (info) {
				sair();
			}
		});
	}
	
	//Chama a função assim que a página for carregada
	verificaUsuario();
	
	//Função que faz o carregamento dos conteúdos das páginas dinamicamente
	carregaDados = function(pagename){
		switch(pagename){
			case "perfil":
				$("#nome").html(usuarioLogado.nome);
				$("#nascimento").html(usuarioLogado.nascimento);
				$("#email").html(usuarioLogado.email);
				$("#login").html(usuarioLogado.login);
				$("#senhaatual").val("");
				$("#novasenha").val("");
				$("#confsenha").val("");
			break;
			case "ranking":
				exibeRankingPontuacaoMaior();
				exibeRankingPontuacaoTotal();
			break;
		}
	}
	
	//Função que faz o carregamento das páginas dinamicamente
	carregaPagina = function(){
		var pagename = window.location.search.substring(1);
		if (pagename==""){
			pagename = "main";
		}
		$("#conteudo").load(pagename+".html", function(response, status, info) {
			if (status == "error") {
				var msg = "Houve um erro ao encontrar a página: "+ info.status + " - " + info.statusText;
				$("#conteudo").html(msg);
			} else {
				carregaDados(pagename);
				$(".tabela2").hide();
			}
		});
	}
	
	alteraUsuario = function(){
		var login = document.frmperfil.txtUsuarioPerfil.value;
		var nome = document.frmperfil.txtNomePerfil.value;
		var email = document.frmperfil.txtEmailPerfil.value;
		var nascimento = document.frmperfil.txtNascimentoPerfil.value;
		var senhaatual = document.frmperfil.pwdSenhaAtual.value;
		var novasenha = document.frmperfil.pwdNovaSenha.value;
		var confsenha = document.frmperfil.pwdConfirmarNovaSenha.value;
		var permissao = document.frmperfil.hdPermissao.value;
		
		if(nome ==""){
			alert("Preencha o campo Nome!");
		} else if(nascimento ==""){
			alert("Preencha o campo Data de Nascimento!");
		} else if(email ==""){
			alert("Preencha o campo Confirmar E-mail!");
		} else if(senhaatual ==""){
			alert("Preencha o campo Senha Atual!");			
		} else if((novasenha !="")&&(confsenha =="")){
				alert("Preencha o campo Confirmar Senha!");
			} else if(novasenha!=confsenha){
				alert("As senhas não coincidem !");
		} else{
			$.ajax({
				type: "POST",
				url: PATH + "EditaUsuario",
				//data: $("#perfilAdm").serialize(),
				data: "login="+login+"&senha="+senhaatual+"&senhanova="+novasenha+"&permissao="+permissao+"&nome="+nome+"&nascimento="+nascimento+"&email="+email,
				success: function (msg) {
					alert(msg.msg);
					if(!msg.erro){
						carregaPagina();
					}
				},
				error: function (info) {
					alert("Erro ao alterar os dados: "+ info.status + " - " + info.statusText);		   
				}
			});
		}
	}
	
	//Função que chama a Servlet que trata da finalização da sessão do jogador
	sair = function(){
		$.ajax({
			type: "POST",
			url: PATH + "Logout",
			success: function (data) {
				window.location.href = (PATH+"index.html");	
			},
			error: function (info) {
				alert("Erro ao tentar encerrar sua sessão: "+ info.status + " - " + info.statusText);	
			}
		});
	}
		alterar = function(){
		  $this = $("#nome");
		  $this.replaceWith( $("<input name='txtNomePerfil' id='nome'/>").val(usuarioLogado.nome));
		  $this = $("#nascimento");
		  $this.replaceWith($("<input type='date' name='txtNascimentoPerfil' id='nascimento'/>").val(dataEN(usuarioLogado.nascimento)));
		  $this = $("#email");
		  $this.replaceWith($("<input name='txtEmailPerfil' id='email'/>").val(usuarioLogado.email));
		  $this = $("#login");
		  $this.replaceWith($("<input name='txtUsuarioPerfil' id='login' readonly/>").val(usuarioLogado.login));
		  $(".tabela2").show();
		  $(".btnAlterar").hide();
		}
		
	    voltar = function(){
	    	$(".tabela2").hide();
	    	$(".btnAlterar").show();
	    	$this = $("#nome");
	    	$this.replaceWith( $("<span id='nome'>"+document.getElementById('nome').value+"</span>"));
	    	$this = $("#nascimento");
	    	$this.replaceWith( $("<span id='nascimento'>"+document.getElementById('nascimento').value+"</span>"));
	    	$this = $("#email");
	    	$this.replaceWith( $("<span id='email'>"+document.getElementById('email').value+"</span>"));
	    	$this = $("#login");
	    	$this.replaceWith( $("<span id='login'>"+document.getElementById('login').value+"</span>"));
	    }
	    
	    dataEN= function (date)
	    {	
	    	return date.split('/').reverse().join('-');
	    }
	    
	    //Função que gera o HTML interno do ranking pontuacao maior
	    geraRankingPontuacaoMaior = function(listaDeJogadores){
	    	var dados ="";
	    	
	    	if (listaDeJogadores != undefined && listaDeJogadores.length > 0){
	    		for (var i=0; i<listaDeJogadores.length; i++){
	    			dados+="<tr>"+
	    			"<td>"+(i +1)+"º"+"</td>"+
	    			"<td>"+listaDeJogadores[i].login+"</td>"+
	    			"<td>"+listaDeJogadores[i].pontosMaior+"</td>"+
	    			"</tr>";
	    		}
	    	}else if(listaDeJogadores==""){
	    		dados+="<tr><td colspan=2>Nenhum Registro Encontrado</td></tr>"
	    	}
	    	return dados;
	    }
	   	
	    exibeRankingPontuacaoMaior = function(){
	   
	    	 html = "<table>" +
						"<tr>" +
						"<th>Lugar</th>"+
						"<th>Usuário</th>"+
						"<th>Pontuacao Maior</th>"+
						"</tr>";
	    	
	    	$.ajax({
	    		type:"POST",
	    		url:PATH+"ConsultaRankingMaior",
	    		success: function(dados){
	    			html+=geraRankingPontuacaoMaior(dados);
	    			html+="</table>";
	    			$("#rankingPontuacaoMaior").html(html);
	    		},
	    		error: function(info){
	    			alert("Erro ao consultar o Ranking de Maior Pontuação: "+ info.status + "-" + info.statusText);
	    		}
	    	});
	    }
	    	    
	    //Função que gera o HTML interno do ranking pontuacao total
	    geraRankingPontuacaoTotal = function(listaDeJogadores){
	    	var dados ="";
	    	
	    	if (listaDeJogadores != undefined && listaDeJogadores.length > 0){
	    		for (var i=0; i<listaDeJogadores.length; i++){
	    			dados+="<tr>"+
	    			"<td>"+(i +1)+"º"+"</td>"+
	    			"<td>"+listaDeJogadores[i].login+"</td>"+
	    			"<td>"+listaDeJogadores[i].pontosTotal+"</td>"+
	    			"</tr>";
	    		}
	    	}else if(listaDeJogadores==""){
	    		dados+="<tr><td colspan=2>Nenhum Registro Encontrado</td></tr>"
	    	}
	    	return dados;
	    }
	    
	    exibeRankingPontuacaoTotal = function(){
	 	   
	    	 htmltotal = "<table>" +
						"<tr>" +
						"<th>Lugar</th>"+
						"<th>Usuário</th>"+
						"<th>Pontuacao Total</th>"+
						"</tr>";
	    	
	    	$.ajax({
	    		type:"POST",
	    		url:PATH+"ConsultaRankingTotal",
	    		success: function(dados){
	    			htmltotal+=geraRankingPontuacaoTotal(dados);
	    			htmltotal+="</table>";
	    			$("#rankingPontuacaoTotal").html(htmltotal);
	    		},
	    		error: function(info){
	    			alert("Erro ao consultar o Ranking de Pontuação Total: "+ info.status + "-" + info.statusText);
	    		}
	    	});
	    }
	    
});
