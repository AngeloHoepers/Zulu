$(document).ready(function(){
	
	//Função que faz o carregamento das páginas dinamicamente
	carregaPagina = function(){
		var pagename="";
		var data="";
		var url = window.location.search.substring(1);
		if (url==""){
			pagename = "main";
		}else {
			var splitted = url.split("=");
			pagename = splitted[0];
			if (splitted[1]){
				data = splitted[1];
			}
		}
		$("#conteudo").load("paginas/visitante/"+pagename+".html", function(response, status, info) {
			if (status == "error") {
				var msg = "Houve um erro ao encontrar a página: "+ info.status + " - " + info.statusText;
				$("#conteudo").html(msg);
			}else {
				carregaDados(pagename);
				ancora(data);
				$("#modals").hide();
			}
		});
	}
	
	//Chama o carregamento da página, fazendo com que a main se abra assim que o site for acessado 
	carregaPagina();
	
	ancora = function(data){
		window.location.href = "#"+ data;
	}
	
	carregaDados = function(pagename){
		switch(pagename){
			case "main":
				exibeRankingPontuacaoMaior();
				exibeRankingPontuacaoTotal();
			break;
		}
	}
	
	//Função que chama a Servlet que trata do cadastro de jogador
	cadastro = function(){
		var nome = document.frmcadastro.txtNome.value;
		var email = document.frmcadastro.txtEmail.value;
		var nascimento = document.frmcadastro.dateDataDeNascimento.value;
		var login = document.frmcadastro.txtUsuario.value;
		var senha = document.frmcadastro.pwdSenha.value;
		var confsenha = document.frmcadastro.pwdConfirmarSenha.value;
		var idade = calcularIdade(document.frmcadastro.dateDataDeNascimento.value);
		var permissao = document.frmcadastro.hdPermissao.value;
		
		if(login ==""){
			alert("Preencha o campo Usuário!");
		} else if(senha ==""){
			alert("Preencha o campo Senha!");
		} else if(confsenha ==""){
			alert("Preencha o campo Confirmar Senha!");
		} else if(nome ==""){
			alert("Preencha o campo Nome!");
		} else if(email ==""){
			alert("Preencha o campo E-mail!");
		} else if(nascimento ==""){
			alert("Preencha o campo Data de Nascimento!");
		} else if(senha!=confsenha){
			alert("As senhas não coincidem !");
		} else{
			$.ajax({
				type: "POST",
				url: "InsereUsuario",
				data: "login="+login+"&senha="+senha+"&idade="+idade+"&permissao="+permissao+"&nome="+nome+"&nascimento="+nascimento+"&email="+email,
				success: function (msg) {
					alert(msg.msg);
					carregaPagina();
				},
				error: function (info) {
					alert("Erro ao cadastrar um novo jogador: "+ info.status + " - " + info.statusText);		   
				}
			});
		}
	}
	
	calcularIdade = function(dateString) {
	    var hoje = new Date();
	    var birthDate = new Date(dateString);
	    var idade = hoje.getFullYear() - birthDate.getFullYear();
	    var m = hoje.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && hoje.getDate() < birthDate.getDate())) 
	    {
	    	idade--;
	    }
	    return idade;
	}
	
	//Função que chama a Servlet que trata da autenticação no sistema
	login = function(){
		var login = document.frmlogin.txtUsuarioModal.value;
		var senha = document.frmlogin.pwdSenhaModal.value;
		if(login ==""){
			alert("Preencha o campo Usuário!");
	    }else if(senha ==""){
	      alert("Preencha o campo Senha!");
	    }else {
			$.ajax({
				type: "POST",
				url: "Login",
				data: "login="+login+"&senha="+senha,
				success: function (msg) {
					if (msg.msg!=null)
						alert(msg.msg);
					else
						window.location.href = msg.url;
				},
				error: function (info) {
					alert("Erro ao tentar login: "+ info.status + " - " + info.statusText);		   
				}
			});
		}
	}
	
	//Função que chama a Servlet que trata do esquecimento da senha
	esqueciSenha = function(){
		var email = document.frmesquecisenha.txtEmailModalES.value;
		var login = document.frmesquecisenha.txtUsuarioModalES.value;
		if(email ==""){
			alert("Preencha o campo Email!");
	    }else if(login ==""){
	      alert("Preencha o campo Usuário!");
	    }else {
	    	$.ajax({
				type: "POST",
				url:"RecuperaSenha",
				data: "email="+email+"&login="+login,
				success: function (msg) {
					if (msg.msg!=null){
						alert(msg.msg);
						carregaPagina();
					}else
						window.location.href = msg.url;
				},
				error: function (info) {
					alert("Erro ao enviar e-mail: "+ info.status + " - " + info.statusText);		   
				}
			});
		}
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
    		dados+="<tr><td colspan=3>Nenhum Registro Encontrado</td></tr>"
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
   		url:"ConsultaRankingMaior",
   		success: function(dados){
   			html+=geraRankingPontuacaoMaior(dados);
   			html+="</table>";
   			$("#rankingMaiorIndex").html(html);
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
    		dados+="<tr><td colspan=3>Nenhum Registro Encontrado</td></tr>"
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
	   		url:"ConsultaRankingTotal",
	   		success: function(dados){
	   			htmltotal+=geraRankingPontuacaoTotal(dados);
	   			htmltotal+="</table>";
	   			$("#rankingTotalIndex").html(htmltotal);
	   		},
	   		error: function(info){
	   			alert("Erro ao consultar o Ranking de Pontuação Total: "+ info.status + "-" + info.statusText);
	   		}
	   	});
   }
	
	modalLogin = function(){
		 $("#modals").show();
			$("#dialog2").hide();
	}
	
	modalEsqueciSenha = function(){
		$("#dialog1").hide();
		$("#dialog2").show();
	}
	
	close1 = function(){
	 $("#modals").hide();
	}
		
	close2 = function(){
		$("#dialog1").show();
		$("#dialog2").hide();
	}
	
});
