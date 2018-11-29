$(document).ready(function(){
	
	var PATH = "../../";
	var usuarioLogado;
	
	//Função que chama a Servlet validação da sessão do usuário
	verificaUsuario = function(){
		$.ajax({
			type: "POST",
			url: PATH + "ValidaSessao",
			data: "p=0",
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
			case"main":
				geraGrafico();
				exibeQuantidadeJogadores();
			break;
			case "perfilDoAdm":
				$("#nome").html(usuarioLogado.nome);
				$("#nascimento").html(usuarioLogado.nascimento);
				$("#email").html(usuarioLogado.email);
				$("#login").html(usuarioLogado.login);
				$("#senhaatual").val("");
				$("#novasenha").val("");
				$("#confsenha").val("");
			break;
			case "rankingAdm":
				exibeRankingPontuacaoMaior();
				exibeRankingPontuacaoTotal();
			break;
			case "visualizarDadosJogadores":
				exibeJogadores();
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
	
	//Função que chama a Servlet que trata do cadastro de jogador
	cadastro = function(){
		var nome = document.frmcadastro.txtNome.value;
		var email = document.frmcadastro.txtEmail.value;
		var nascimento = document.frmcadastro.dateDataDeNascimento.value;
		var login = document.frmcadastro.txtUsuario.value;
		var senha = document.frmcadastro.pwdSenha.value;
		var confsenha = document.frmcadastro.pwdConfirmarSenha.value;
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
				url: PATH + "InsereAdmin",
				data: $("#cadastroDoAdmin").serialize(),
				success: function (msg) {
					alert(msg.msg);
					carregaPagina();
				},
				error: function (info) {
					alert("Erro ao cadastrar um novo administrador: "+ info.status + " - " + info.statusText);		   
				}
			});
		}
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
						verificaUsuario();
					}
				},
				error: function (info) {
					alert("Erro ao alterar os dados: "+ info.status + " - " + info.statusText);		   
				}
			});
		}
	}
	
	//Função que chama a Servlet que trata da finalização da sessão do admin
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
	    	carregaPagina();
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
	    		url:PATH+"ConsultaRankingMaior",
	    		success: function(dados){
	    			html+=geraRankingPontuacaoMaior(dados);
	    			html+="</table>";
	    			$("#rankingMaiorAdm").html(html);
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
	    		url:PATH+"ConsultaRankingTotal",
	    		success: function(dados){
	    			htmltotal+=geraRankingPontuacaoTotal(dados);
	    			htmltotal+="</table>";
	    			$("#rankingTotalAdm").html(htmltotal);
	    		},
	    		error: function(info){
	    			alert("Erro ao consultar o Ranking de Pontuação Total: "+ info.status + "-" + info.statusText);
	    		}
	    	});
	    }
	    
	    exibeGrafico = function(primeira, segunda, terceira, quarta, quinta){
	    	
	    	var soma = primeira + segunda + terceira + quarta + quinta;
	    	
	    	var ctx = document.getElementById("line-chart").getContext('2d');
		    var chartGraph = new Chart(ctx, {
		        type: 'pie',
		        data: {
		            datasets: [{
		                data: [
		                       primeira,
		                       segunda,
		                       terceira,
		                       quarta, 
		                       quinta
		                       /*idade5a10, 
		                       idade11a15, 
		                       idade16a20,
		                       idade21a25,
		                       idade26a30*/
		                       ],
		                backgroundColor: [
							'rgba(255, 99, 132, 0.8)',
							'rgba(54, 162, 235, 0.8)',
							'rgba(255, 206, 86, 0.8)',
							'rgba(75, 192, 192, 0.8)',
							'rgba(153, 102, 255, 0.8)',
							'rgba(255, 159, 64, 0.8)'
		                ],
		            }],
		    		labels: [
		    		         "5 a 10 anos", 
		    		         "11 a 15 anos", 
		    		         "16 a 20 anos",
		    		         "21 a 25 anos",
		    		         "26 a 30 anos"
		    		         ],
		        },
		        options: {
		            tooltips: {
		                callbacks: {
		                  label: function(tooltipItem, data) {
		                  	var dataset = data.datasets[tooltipItem.datasetIndex];
		                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
		                      return previousValue + currentValue;
		                    });
		                    var currentValue = dataset.data[tooltipItem.index];
		                    var precentage = Math.floor(((currentValue/soma) * 100)+0.5);         
		                    return precentage + "%";
		                  }
		                }
		              }
		        }
		    });
	    }
	    
	    geraGrafico = function() {
	    	
	    	
			
	    	$.ajax({
				type: "POST",
				url: PATH + "ConsultaUsuariosGrafico",
				success: function(idade){
					
					var primeira = 0;
			    	var segunda = 0;
			    	var terceira = 0;
			    	var quarta = 0;
			    	var quinta = 0;
					
					var n = idade.length;
					console.log(idade);
					
					for (var i=0; i<n; i++){
						
						if((idade[i]>=5)&&(idade[i]<=10)){
							primeira++
						}else if((idade[i]>=11)&&(idade[i]<=15)){
							segunda++
						}else if((idade[i]>=16)&&(idade[i]<=20)){
							terceira++
						}else if((idade[i]>=21)&&(idade[i]<=25)){
							quarta++
						}else if((idade[i]>=26)&&(idade[i]<=30)){
							quinta++
						}
		    			
		    		}
					exibeGrafico(primeira, segunda, terceira, quarta, quinta);
					
				},
				error: function(info){
					alert("Erro ao consultar gráfico: "+ info.status + " - " + info.statusText);
				}
			});
	    	
		}
	    
	  //Função que chama a Servlet que trata da busca dos usuários registrados, conforme filtro
		exibeJogadores = function(){
			var html = "<table>" +
					"<tr>" +
					"<th>Nome</th>" +
					"<th>Data de Nascimento</th>" +
					"<th>E-mail</th>" +
					"<th>Usuário</th>" +
					"</tr>";
			
			$.ajax({
				type: "POST",
				url: PATH + "ConsultaUsuarios",
				success: function(dados){
					html += geraTabelaJogadores(dados);
					html += "</table>";
					$("#tabelaJogadores").html(html);
				},
				error: function(info){
					alert("Erro ao consultar os contatos: "+ info.status + " - " + info.statusText);
				}
			});
			
		};

		//Função que gera o HTML interno da tabela de jogadores registrados
		geraTabelaJogadores = function(listaDeJogadores) {
			var dados = "";
			if (listaDeJogadores != undefined && listaDeJogadores.length > 0){
				for (var i=0; i<listaDeJogadores.length; i++){
					dados += "<tr>" +
							"<td>"+listaDeJogadores[i].nome+"</td>" +
							"<td>"+listaDeJogadores[i].nascimento+"</td>" +
							"<td>"+listaDeJogadores[i].email+"</td>" +
							"<td>"+listaDeJogadores[i].login+"</td>" +
							"</tr>"
				}
			} else if (listaDeJogadores == ""){
				dados += "<tr><td colspan='4'>Nenhum registro encontrado</td></tr>";
			}
			return dados;
		}	
		
		exibeQuantidadeJogadores = function(){
			var html = "<p>";
			
			$.ajax({
				type: "POST",
				url: PATH + "ConsultaQuantidadeJogadores",
				success: function(dados){
					console.log(dados);
					html += dados;
					html += "</p>";
					$("#TotCadastro").html(html);
				},
				error: function(info){
					alert("Erro ao consultar a quantidade de jogadores cadastrados: "+ info.status + " - " + info.statusText);
				}
			});
			
		};
});