var timer;
var total = 0;
var idSapo;

var horaAtual;
var hora;
var fundoSapo;
var fundoGirino;

var PATH = "../../";
 
var status;
var tipo;
var primeiraVez = 0;

var moedas = 0;
var qntDinheiro;

var segundos = 0;
var minutos = 0;
var horas = 0;
var repetidor = 0;

//Barrinhas
var pctSaude;
var pctDiversao;
var pctAlimentacao;

var saude;
var comida;
var diversao;

//posicao do coco
var spawnX;
var spawnY;

//botao Pausar-Continuar
var isPaused = false;
var confTempo;

//pontuacao
var pontuacao;
var tempo;

class menuInicial extends Phaser.Scene{
	
    constructor (){
        super({ key: 'menuInicial' });
    }

    preload (){
        this.load.image('fundoMenuInicial',PATH + 'addons/jogo/imagens/fundo/fundoDesfocado.png');
        this.load.image('logo', PATH + 'addons/jogo/imagens/logo/logo.png');
        this.load.image('jogar', PATH + 'addons/jogo/imagens/icones/botaoJogar.png');
        this.load.image('ajuda', PATH + 'addons/jogo/imagens/icones/botaoAjuda.png');
    }

    create (){
    	
        //Fundo
        let fundoMenuInicial = this.add.sprite(0, 0, 'fundoMenuInicial').setDisplaySize(950,450);
        fundoMenuInicial.setOrigin(0, 0);

        let logo = this.add.image(this.sys.game.config.width / 2, 100,'logo');
        this.jogar = this.add.image(this.sys.game.config.width / 2, 270,'jogar').setInteractive();
        this.ajuda = this.add.image(this.sys.game.config.width / 2, 350,'ajuda').setInteractive();
        
        this.jogar.setDisplaySize(255,65);
        this.ajuda.setDisplaySize(255,65);
        
        this.jogar.on('pointerdown', function () {
        		   		 
	   		$.ajax({
				type: "POST",
				url: PATH + "ConsultaVivos",
				success: function(sapo){
					console.log(sapo);
					
					idSapo = sapo.id;
					console.log("Peguei o id:" + idSapo);
					
					pctDiversao = sapo.diversao;
					pctSaude = sapo.limpeza;
					pctAlimentacao = sapo.alimentacao;
					
					console.log("D "+pctDiversao);
					console.log("S "+pctSaude);
					console.log("A "+pctAlimentacao);
									
				},
				error: function(info){
					alert("Erro ao consultar a porcentagem das barrinhas do sapo: "+ info.status + " - " + info.statusText);
				}
			});
   		 

        	$.ajax({
				type: "POST",
				url: PATH + "ConsultaSapos",
				success: function(situacao){
					
					if(situacao == 0){
						
						$.ajax({
							type: "POST",
							url: PATH + "InsereSapos",
							success: function(){
								game.scene.start('ovoDoGirino');
						
							},
							error: function(info){
								alert("Erro ao adicionar o sapo: "+ info.status + " - " + info.statusText);
							}
						});			

						/*console.log(idSapo);
						$.ajax({
							type: "POST",
							url: PATH + "InsereProdutoInventario",
							data: "idSapo="+idSapo,
							success: function(){
								alert("Item comprado com sucesso!");
							},
							error: function(info){
								alert("Erro ao atualizar inventário do sapo: "+ info.status + " - " + info.statusText);
							}
						});		*/
						
					}else if(situacao == 1){
						
						$.ajax({
							type: "POST",
							url: PATH + "ConsultaVivos",
							success: function(sapo){
								
								if(sapo.tempo == "00:00:00"){
									chamaOvo();
								}else if ((sapo.tempo >= "00:00:01") && (sapo.tempo <= "00:09:59")){
									chamaGirino();
								}else {
									game.scene.start('sapo');
								}
								
							},
							error: function(info){
								alert("Erro ao consultar o tempo do sapo: "+ info.status + " - " + info.statusText);
							}
						});
												
					}
				},
				error: function(info){
					alert("Erro ao consultar os sapos: "+ info.status + " - " + info.statusText);
				}
			});
        	
            this.scene.stop('menuInicial');

        }, this);
        
        this.ajuda.on('pointerdown', function () {

            this.scene.start('ajuda');

        }, this);
    }
}

class ovoDoGirino extends Phaser.Scene{
    constructor (){
        super({ key: 'ovoDoGirino' });
    }

    preload (){
        this.load.image('fundo', PATH + 'addons/jogo/imagens/fundo/fundoDesfocado.png');
        this.load.image('ovo', PATH + 'addons/jogo/imagens/ovos/ovo.png');
        this.load.image('ovo1', PATH + 'addons/jogo/imagens/ovos/ovo1.png');
        this.load.image('ovo2', PATH + 'addons/jogo/imagens/ovos/ovo2.png');
        this.load.image('ovo3', PATH + 'addons/jogo/imagens/ovos/ovo3.png');
        this.load.image('ovo4', PATH + 'addons/jogo/imagens/ovos/ovo4.png');
        this.load.image('ovo5', PATH + 'addons/jogo/imagens/ovos/ovo5.png');
        this.load.image('ovo6', PATH + 'addons/jogo/imagens/ovos/ovo6.png');
        this.load.image('ovo7', PATH + 'addons/jogo/imagens/ovos/ovo7.png');
        this.load.image('ovo8', PATH + 'addons/jogo/imagens/ovos/ovo8.png');
        this.load.image('girino', PATH + 'addons/jogo/imagens/coresGirinos/girino1.png');
        
    }

    create (){
    	
        //Fundo
        let fundo = this.add.sprite(0, 0, 'fundo').setDisplaySize(950,450);
        fundo.setOrigin(0, 0);
        
        this.texto = this.add.text(200, 95, 'Clique para chocar o ovo!', { fontSize: '40px', fill: '#ffffff' });
        
        this.ovo = this.add.image(this.sys.game.config.width / 2, 270,'ovo').setInteractive();
        this.ovo.setDisplaySize(250,250);
                
        this.ovo.on('pointerdown', function () {
        	this.ovo.destroy();
        	this.ovo1 = this.add.sprite(this.sys.game.config.width / 2, 270,'ovo1').setInteractive();
        	this.ovo1.setDisplaySize(250,250);
        	this.cameras.main.shake(150);
        	
        	this.ovo1.on('pointerdown', function () {
        		this.ovo1.destroy();
            	this.ovo2 = this.add.sprite(this.sys.game.config.width / 2, 270,'ovo2').setInteractive();
            	this.ovo2.setDisplaySize(250,250);
            	this.cameras.main.shake(150);
            	
            	this.ovo2.on('pointerdown', function () {
            		this.ovo2.destroy();
                	this.ovo3 = this.add.sprite(this.sys.game.config.width / 2, 270,'ovo3').setInteractive();
                	this.ovo3.setDisplaySize(250,250);
                	this.cameras.main.shake(150);
                	
                	this.ovo3.on('pointerdown', function () {
                		this.ovo3.destroy();
                    	this.ovo4 = this.add.sprite(this.sys.game.config.width / 2, 270,'ovo4').setInteractive();
                    	this.ovo4.setDisplaySize(250,250);
                    	this.cameras.main.shake(150);
                    	
                    	this.ovo4.on('pointerdown', function () {
                    		this.ovo4.destroy();
                        	this.ovo5 = this.add.sprite(this.sys.game.config.width / 2, 270,'ovo5').setInteractive();
                        	this.ovo5.setDisplaySize(250,250);
                        	this.cameras.main.shake(150);
                        	
                        	this.ovo5.on('pointerdown', function () {
                        		this.ovo5.destroy();
                            	this.ovo6 = this.add.sprite(this.sys.game.config.width / 2, 270,'ovo6').setInteractive();
                            	this.ovo6.setDisplaySize(250,250);
                            	this.cameras.main.shake(150);
                            	
                            	this.ovo6.on('pointerdown', function () {
                            		this.ovo6.destroy();
                                	this.ovo7 = this.add.sprite(this.sys.game.config.width / 2, 270,'ovo7').setInteractive();
                                	this.ovo7.setDisplaySize(250,250);
                                	this.cameras.main.shake(150);
                                	
                                	this.ovo7.on('pointerdown', function () {
                                		this.ovo7.destroy();
                                    	this.ovo8 = this.add.sprite(this.sys.game.config.width / 2, 270,'ovo8').setInteractive();
                                    	this.ovo8.setDisplaySize(250,250);
                                    	this.cameras.main.shake(500);
                                    	
                                    	this.ovo8.on('pointerdown', function () {
                                    		this.ovo8.destroy();
                                        	this.cameras.main.shake(1000);
                                        	
                                        	primeiraVez = 1;
                                        	
                                        	this.scene.start('girino')
                                        	this.scene.stop('ovoDoGirino')
                                        	                                        	
                                    	}, this);
                                	}, this);
                            	}, this);
                        	}, this);
                    	}, this);
                	}, this);
            	}, this);
        	}, this);
        }, this);
    }
    
}

class ajuda extends Phaser.Scene{
	
	constructor (){
        super({ key: 'ajuda' });
    }
	
	preload(){
		 this.load.image('fundo', PATH + 'addons/jogo/imagens/fundo/fundoDesfocado.png');
		 this.load.image('retangulo', PATH + 'addons/jogo/imagens/fundo/retanguloPreto.png')
		 this.load.image('logo', PATH + 'addons/jogo/imagens/logo/logo.png');
		 this.load.image('botaoFechar', PATH + 'addons/jogo/imagens/icones/botaoFechar.png');
	}
	
	create(){
		
		// Fundo
        let fundo = this.add.sprite(0, 0, 'fundo').setDisplaySize(950,450);
        fundo.setOrigin(0,0);
        let logo = this.add.image(this.sys.game.config.width / 2, 100,'logo');
        
        // Retangulo
        let retangulo = this.add.sprite(this.sys.game.config.width / 2, 320, 'retangulo').setDisplaySize(880,300);
		
		// Texto de Ajuda
		this.AjudaText = this.add.text(130, 250, '	Nesse jogo seu trabalho será cuidar do nosso querido Zulu, bem como o '
				+ 'alimentar, divertir, e manter a limpeza de sua lagoa. Para isso você '
				+ 'terá a ajuda de uma belíssima loja onde poderá encontrar alimentos e '
				+ 'também cores e acessórios para personalizar seu sapo.',
				{ fontSize: '20px', fill: '#fff'});
		this.AjudaText.setWordWrapWidth(700);	

    	//Botão voltar 
	    this.voltarImg = this.add.sprite(830, 30, 'botaoFechar').setDisplaySize(40, 40);
	    this.voltarImg.setInteractive();
	    this.voltarImg.on('pointerdown', function () {

          this.scene.start('menuInicial');
          this.scene.stop('ajuda');  
                
	    }, this);	
        
	}
}

class girino extends Phaser.Scene{
	
	constructor (){
        super({ key: 'girino' });
    }
	
	preload(){
		 this.load.image('fundoGirinoDia', PATH + 'addons/jogo/imagens/fundo/fundoGirino.png');
		 this.load.image('fundoGirinoNoite', PATH + 'addons/jogo/imagens/fundo/fundoGirinoNoite.png');
		 this.load.image('girino', PATH + 'addons/jogo/imagens/coresGirinos/girino1.png'); 
		 this.load.image('retanguloFundo', PATH + 'addons/jogo/imagens/fundo/retanguloAzul.png');
		 this.load.image('quadradoFundo', PATH + 'addons/jogo/imagens/fundo/quadradoAzul.png');
		 
		 // Icones
		 this.load.image('dinheiro', PATH + 'addons/jogo/imagens/icones/dinheiro.png');
		 this.load.image('controle', PATH + 'addons/jogo/imagens/icones/controle.png');
		 this.load.image('loja', PATH + 'addons/jogo/imagens/icones/loja.png');
		 this.load.image('inv', PATH + 'addons/jogo/imagens/icones/inventario.png');
		 this.load.image('botaoOK', PATH + 'addons/jogo/imagens/icones/botaoOK.png')
		 this.load.image('botaoMenu', PATH + 'addons/jogo/imagens/icones/botaoMenu.png');
		 this.load.image('coco', PATH + 'addons/jogo/imagens/icones/bosta.png');
		 
		 // Barrinha de Saude
		 this.load.image('saude', PATH + 'addons/jogo/imagens/barrinhas/saude0.png');
		 
		// Barrinha de Alimentação
		 this.load.image('comida', PATH + 'addons/jogo/imagens/barrinhas/comida0.png');
		 
		// Barrinha de Diversão
		 this.load.image('diversao', PATH + 'addons/jogo/imagens/barrinhas/diversao0.png');
	}
	
	create(){	
		
	    //tipo para informar que é um girino
        tipo = 0;
        
		this.scene.sleep('menuInterno');

		//chama a função do relogio
		relogio(segundos, repetidor, minutos, horas);
		
		game.scene.stop('ovoGirino');
		atualizarMoedas();
		
		$.ajax({
			type: "POST",
			url: PATH + "ConsultaVivos",
			success: function(sapo){
				console.log(sapo);
				
				idSapo = sapo.id;
				
				pctDiversao = sapo.diversao;
				pctSaude = sapo.limpeza;
				pctAlimentacao = sapo.alimentacao;
				
				console.log("D "+pctDiversao);
				console.log("S "+pctSaude);
				console.log("A "+pctAlimentacao);
								
			},
			error: function(info){
				alert("Erro ao consultar a porcentagem das barrinhas do sapo: "+ info.status + " - " + info.statusText);
			}
		});
		
		$.ajax({
			type: "POST",
			url: PATH + "ConverteTempo",
			success: function(sapo){
				horas = sapo[0]+sapo[1];
				minutos = sapo[3]+sapo[4];
				segundos = sapo[6]+sapo[7];
			},
			error: function(info){
				alert("Erro ao adicionar o sapo: "+ info.status + " - " + info.statusText);
			}
		});
				
		//Sistema de horario mudar fundo (6h até 18h Dia)
		var h = horaAtual(hora);
		if((h < 18)&&(h > 6)){
			// Fundo Dia
			fundoSapo = this.add.sprite(0, 0, 'fundoGirinoDia').setDisplaySize(950,450);
			fundoSapo.setOrigin(0,0);
		}else {
			// Fundo Noite
			fundoSapo = this.add.sprite(0, 0, 'fundoGirinoNoite').setDisplaySize(950,450);
			fundoSapo.setOrigin(0,0);
		}
		
	   // Imagem do Girino
	   let girino = this.add.sprite(510, 300, 'girino');
	   girino.setDisplaySize(250, 250);
       
	   // HUD
	   let retanguloFundo = this.add.sprite(70, 30, 'retanguloFundo');
	   retanguloFundo.setDisplaySize(140, 45);
	   
	   let dinheiro = this.add.sprite(30, 30, 'dinheiro');
	   dinheiro.setDisplaySize(40, 25);
	   
	   qntDinheiro = this.add.text(65, 15, '0', { fontSize: '30px', fill: '#fff'});
	   
	 //Barrinhas
	   //Barrinha Saude
	   this.saude_barra = this.add.graphics();
	   this.saude = this.add.sprite(100, 130, 'saude');
	   this.saude.setDisplaySize(200, 90);
	   this.saude_barra.fillStyle(0x23a318, 1);
      
       //Barrinha Alimentação
       this.comida_barra = this.add.graphics();
	   this.comida = this.add.sprite(100, 180, 'comida');
	   this.comida.setDisplaySize(200, 90);
	   this.comida_barra.fillStyle(0x23a318, 1);
	   
	   //Barrinha Diversão
	   this.diversao_barra = this.add.graphics();
	   this.diversao = this.add.sprite(100, 230, 'diversao');
	   this.diversao.setDisplaySize(200, 90);
	   this.diversao_barra.fillStyle(0x23a318, 1);
	   	   
	   //Botão do Menu
	   this.menu = this.add.image(875, 25, 'botaoMenu');
	   this.menu.setInteractive();
	   this.menu.setDisplaySize(35, 30);
	   
	   this.menu.on('pointerdown', function(){
		   
		   this.scene.start('menuInterno');
		   
	   } ,this);
	   
	   this.loja = this.add.image(875, 70, 'loja');
	   this.loja.setInteractive();
	   this.loja.setDisplaySize(35, 40);
	   
	   this.loja.on('pointerdown', function () {
		   
           this.scene.start('comidasLoja');      
           
       }, this);
	   
	   this.controle = this.add.sprite(875, 110, 'controle');
       this.controle.setDisplaySize(35, 30);
       this.controle.setInteractive();
       
       this.controle.on('pointerdown', function () {
    	   
           this.scene.start('jogoDaMemoria');

       } ,this);
	   
	   if(primeiraVez == 1){
		   // Imagem do Fundo
		   this.msg = this.add.sprite(450, 225, 'quadradoFundo');
		   this.msg.setDisplaySize(300, 300);
		   
		   // Texto de Ajuda
		   this.msgText = this.add.text(320, 150, '	Esse é Zulu, por enquanto ele ainda é um girino, mas com a ajuda de seus cuidados em breve se tornará um lindo sapo.',{ fontSize: '20px', fill: '#fff'});
		   this.msgText.setWordWrapWidth(270);	
		
		   // Botão OK 
		   this.okBotao = this.add.sprite(450, 340, 'botaoOK');
		   this.okBotao.setInteractive();
		   this.okBotao.setDisplaySize(40, 40);
		   
		   this.okBotao.on('pointerdown', function () {
			   this.msg.destroy();
			   this.msgText.destroy();
			   this.okBotao.destroy();
			   primeiraVez = 0;
		   }, this);
	   } else{
		   primeiraVez = 1;
	   }	    	   	
	  	   
	   //adicionaItensInv();
	   
	}//create
	
	update(){		
		
if(confTempo == 0){
			
			var coco = new Array;
			var numeroSorteado = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
							
				if (numeroSorteado == 1){
					
					//Posicao do coco       		
					spawnX = 70;
					spawnY = 250;
					
				}else if (numeroSorteado == 2){					    	   
					
					//Posicao do coco
					spawnX = 100;
					spawnY = 260;
					
				}else if (numeroSorteado == 3){
					
					//Posicao do coco
					spawnX = 130;
					spawnY = 270;
					
				}else if (numeroSorteado == 4){				    	   
					
					//Posicao do coco
					spawnX = 160;
					spawnY = 280;					
					
				}else if (numeroSorteado == 5){					    	   
					
					//Posicao do coco
					spawnX = 190;
					spawnY = 290;					
					
				}else if (numeroSorteado == 6){
					
					//Posicao do coco
					spawnX = 210;
					spawnY = 300;
					
				}else if (numeroSorteado == 7){
					
					//Posicao do coco
					spawnX = 240;
					spawnY = 240;   	   
					
				}else if (numeroSorteado == 8){
					
					//Posicao do coco
					spawnX = 270;
					spawnY = 240;   		    		   					    	   
					
				}else if (numeroSorteado == 9){
					
					//Posicao do coco
					spawnX = 300;
					spawnY = 300;   	
				} 

				console.log("numeroSorteado = "+numeroSorteado);						
				confTempo= 1;
				coco[numeroSorteado] = this.add.sprite(spawnX, spawnY, 'coco').setDisplaySize(35,30).setInteractive();
				pctSaude = parseInt(pctSaude) - 10; 
			
				coco[numeroSorteado].on('pointerdown', function(){
				
				this.destroy();
				pctSaude = parseInt(pctSaude) + 10; 
				atualizaDados();
			});
			
		}//confTempo
		
		if(pctDiversao>100){
			pctDiversao=100;
		}
		if(pctSaude>100){
			pctSaude=100;
		}
		if(pctAlimentacao>100){
			pctAlimentacao=100;
		}

		//Barrinhas
		this.saude_barra.fillRect(32.5, 92, 1.6*pctSaude  , 30);
		this.comida_barra.fillRect(32.5, 142, 1.6*pctAlimentacao  , 30);
		this.diversao_barra.fillRect(32.5, 192, 1.6*pctDiversao  , 30);
				
		// Chama a função de pegar hora atual
		horaAtual();
				
		//Faz a contagem de 10 min para mudar para Sapo
		if(minutos == 10){
			chamaSapo();
			primeiraVez = 1;
		}
	}    
}

class sapo extends Phaser.Scene{
	
	constructor (){		
        super({ key: 'sapo' });
    }
	
	preload(){		
		 this.load.image('fundoSapoDia', PATH + 'addons/jogo/imagens/fundo/fundoSapo.png');
		 this.load.image('fundoSapoNoite', PATH + 'addons/jogo/imagens/fundo/fundoSapoNoite.png');
		 this.load.image('sapo', PATH + 'addons/jogo/imagens/coresSapo/sapoOficial.png');
		 this.load.image('retanguloFundoSapo', PATH + 'addons/jogo/imagens/fundo/retanguloAzul.png');
		 this.load.image('quadradoFundo', PATH + 'addons/jogo/imagens/fundo/quadradoAzul.png');
		 
		 // Icones
		 this.load.image('dinheiro', PATH + 'addons/jogo/imagens/icones/dinheiro.png');
		 this.load.image('controle', PATH + 'addons/jogo/imagens/icones/controle.png');
		 this.load.image('loja', PATH + 'addons/jogo/imagens/icones/loja.png');
		 this.load.image('botaoOK', PATH + 'addons/jogo/imagens/icones/botaoOK.png');
		 this.load.image('botaoMenu', PATH + 'addons/jogo/imagens/icones/botaoMenu.png');
	     this.load.image('coco', PATH + 'addons/jogo/imagens/icones/bosta.png');
		 
		// Barrinha de Saude
		 this.load.image('saude', PATH + 'addons/jogo/imagens/barrinhas/saude0.png');
		 
		// Barrinha de Alimentação
		 this.load.image('comida', PATH + 'addons/jogo/imagens/barrinhas/comida0.png');
		 
		// Barrinha de Diversão
		 this.load.image('diversao', PATH + 'addons/jogo/imagens/barrinhas/diversao0.png');
		 
	}
	
	create(){
		
	    //tipo para informar que é um sapo
        tipo = 1;
		
		this.scene.sleep('menuInterno');

		//chama a função do relogio
		relogio(segundos, repetidor, minutos, horas);
				
		game.scene.stop('girino');
		atualizarMoedas();
		
		$.ajax({
			type: "POST",
			url: PATH + "ConverteTempo",
			success: function(sapo){
				horas = sapo[0]+sapo[1];
				minutos = sapo[3]+sapo[4];
				segundos = sapo[6]+sapo[7];				
			},
			error: function(info){
				alert("Erro ao adicionar o sapo: "+ info.status + " - " + info.statusText);
			}
		});
		
		// Sistema de horario mudar fundo (6h até 18h Dia)
		var h = horaAtual(hora);
		if((h < 18)&&(h > 6)){
			// Fundo Dia
			fundoSapo = this.add.sprite(0, 0, 'fundoSapoDia').setDisplaySize(950,450);
			fundoSapo.setOrigin(0,0);
		}else {
			// Fundo Noite
			fundoSapo = this.add.sprite(0, 0, 'fundoSapoNoite').setDisplaySize(950,450);
			fundoSapo.setOrigin(0,0);
		}
		
       // Imagem do sapo
       let sapo = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'sapo');
       sapo.setDisplaySize(250, 250);
              
       // HUD       
       let retanguloFundoSapo = this.add.sprite(70, 30, 'retanguloFundoSapo');
	   retanguloFundoSapo.setDisplaySize(140, 45);
	   
	   let dinheiro = this.add.sprite(30, 30, 'dinheiro');
	   dinheiro.setDisplaySize(40, 25);
	   
	   qntDinheiro = this.add.text(65, 15, '0', { fontSize: '30px', fill: '#fff'});
	   
	   //Barrinhas
	   this.saude_barra = this.add.graphics();
	   this.saude = this.add.sprite(100, 130, 'saude');
	   this.saude.setDisplaySize(200, 90);
	   this.saude_barra.fillStyle(0x23a318, 1);
       
       this.comida_barra = this.add.graphics();
	   this.comida = this.add.sprite(100, 180, 'comida');
	   this.comida.setDisplaySize(200, 90);
	   this.comida_barra.fillStyle(0x23a318, 1);
	  
	   this.diversao_barra = this.add.graphics();
	   this.diversao = this.add.sprite(100, 230, 'diversao');
	   this.diversao.setDisplaySize(200, 90);
	   this.diversao_barra.fillStyle(0x23a318, 1);
	   
	   //Botão do Menu
	   this.menu = this.add.image(875, 25, 'botaoMenu');
	   this.menu.setInteractive();
	   this.menu.setDisplaySize(35, 30);
	   
	   this.menu.on('pointerdown', function(){
		   this.scene.pause();
		   this.scene.start('menuInterno');
		   
	   } ,this);
	   
	   this.loja = this.add.image(875, 70, 'loja');
	   this.loja.setInteractive();
	   this.loja.setDisplaySize(35, 40);
	   
	   this.loja.on('pointerdown', function () {
		   
		   atualizaDados();
           this.scene.start('comidasLoja');   
           
       }, this);	   

	   this.controle = this.add.sprite(875, 110, 'controle');
       this.controle.setDisplaySize(35, 30);
       this.controle.setInteractive();
	   
       this.controle.on('pointerdown', function () {

           this.scene.start('jogoDaMemoria');

       } ,this);
              
       if(primeiraVez == 1){
		   // Imagem do Fundo
		   this.msg = this.add.sprite(450, 225, 'quadradoFundo');
		   this.msg.setDisplaySize(300, 300);
		   
		   // Texto de Bem-Vindo
		   this.msgText = this.add.text(320, 150, '	Olha só o Zulu finalmente se transformou em um sapo continue cuidando dele, visite a loja para ver as novidades.',{ fontSize: '20px', fill: '#fff'});
		   this.msgText.setWordWrapWidth(270);
		
		   // Botão OK 
		   this.okBotao = this.add.sprite(450, 340, 'botaoOK');
		   this.okBotao.setInteractive();
		   this.okBotao.setDisplaySize(40, 40);
		   
		   this.okBotao.on('pointerdown', function () {
			   this.msg.destroy();
			   this.msgText.destroy();
			   this.okBotao.destroy();
			   primeiraVez = 0;
		   }, this);
	   } else{
		   primeiraVez = 1;
	   }
	 
	}//create
	
	update(){		
		
		if(confTempo == 0){			
			var coco = new Array;
			var numeroSorteado = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			
				if (numeroSorteado == 1){
					
					//Posicao do coco       		
					spawnX = 70;
					spawnY = 250;
					
				}else if (numeroSorteado == 2){					    	   
					
					//Posicao do coco
					spawnX = 100;
					spawnY = 260;
					
				}else if (numeroSorteado == 3){
					
					//Posicao do coco
					spawnX = 130;
					spawnY = 270;
					
				}else if (numeroSorteado == 4){				    	   
					
					//Posicao do coco
					spawnX = 160;
					spawnY = 280;					
					
				}else if (numeroSorteado == 5){					    	   
					
					//Posicao do coco
					spawnX = 190;
					spawnY = 290;					
					
				}else if (numeroSorteado == 6){
					
					//Posicao do coco
					spawnX = 210;
					spawnY = 300;
					
				}else if (numeroSorteado == 7){
					
					//Posicao do coco
					spawnX = 240;
					spawnY = 240;   	   
					
				}else if (numeroSorteado == 8){
					
					//Posicao do coco
					spawnX = 270;
					spawnY = 240;   		    		   					    	   
					
				}else if (numeroSorteado == 9){
					
					//Posicao do coco
					spawnX = 300;
					spawnY = 300;   	
				} 
				
				console.log("numeroSorteado = "+numeroSorteado);						
				confTempo= 1;
				coco[numeroSorteado] = this.add.sprite(spawnX, spawnY, 'coco').setDisplaySize(35,30).setInteractive();
				pctSaude = parseInt(pctSaude) - 10; 
				
				coco[numeroSorteado].on('pointerdown', function(){
					
					this.destroy();
					pctSaude = parseInt(pctSaude) + 10; 
					atualizaDados();
				});
			
		}//confTempo

		if(pctDiversao>100){
			pctDiversao=100;
		}
		if(pctSaude>100){
			pctSaude=100;
		}
		if(pctAlimentacao>100){
			pctAlimentacao=100;
		}
		
		//Barrinhas
		this.diversao_barra.fillRect(32.5, 192, 1.6*pctDiversao  , 30);
		this.saude_barra.fillRect(32.5, 92, 1.6*pctSaude  , 30);	      
		this.comida_barra.fillRect(32.5, 142, 1.6*pctAlimentacao  , 30);
				
		// Chama a função de pegar hora atual
		horaAtual();
		
		//Verifica se alguma barrinha chegou a 0, se sim o sapo morre
		if(((pctAlimentacao <= 0)||(pctDiversao <= 0))||(pctSaude <= 0)){
			status = 1;
			console.log("status- "+ status);
			alert("Infelizmente o Zulu morreu!!");

			isPaused = true;
			
			$.ajax({
				type: "POST",
				url: PATH + "ConverteTempo",
				success: function(sapo){
					horas = sapo[0]+sapo[1];
					minutos = sapo[3]+sapo[4];
					console.log("h- "+ horas);
					console.log("m- "+ minutos);
					
					//pontuacao
					if (horas == 0){
						tempo = minutos/60;
					}else if (horas != 0){
						tempo = horas;						
					}
					console.log("t- "+tempo);
					
					pontuacao = tempo * 200;
					alert("Sua pontuação total foi de: "+pontuacao);
					
					$.ajax({
						type: "POST",
						url: PATH + "AtualizaDados",
						data: "diversao="+pctDiversao+"&alimentacao="+pctAlimentacao+"&limpeza="+pctSaude+"&tempo="+horas+":"+minutos+":"+segundos+ "&moedas="+moedas+"&status=1&pontuacao="+pontuacao+"&pontuacaoTotal=0&pontuacaoMaior=0",
						success: function(sapo){
							
						},
						error: function(info){
							alert("Erro ao atualizar os dados do sapo: "+ info.status + " - " + info.statusText);
						}
					});
						
				},
				error: function(info){
					alert("Erro ao adicionar o sapo: "+ info.status + " - " + info.statusText);
				}
			});		
			
			this.scene.start('menuInicial');
				
							
		}// fim do if das porcentagens
		
	}//fim do update
}

class menuInterno extends Phaser.Scene{
	
	constructor() {
		super({ key: 'menuInterno'});
	}	
	
	preload() {
		this.load.image('fundoMenuInterno',PATH + 'addons/jogo/imagens/fundo/fundoDesfocado.png');
        this.load.image('logo', PATH + 'addons/jogo/imagens/logo/logo.png');
        this.load.image('salvar', PATH + 'addons/jogo/imagens/icones/botaoSalvar.png');
        this.load.image('pausar', PATH + 'addons/jogo/imagens/icones/botaoPausar.png');
        this.load.image('continuar', PATH + 'addons/jogo/imagens/icones/botaoContinuar.png');
        this.load.image('reiniciar', PATH + 'addons/jogo/imagens/icones/botaoReiniciar.png');
        this.load.image('botaoFechar', PATH + 'addons/jogo/imagens/icones/botaoFechar.png');
	}
	
	create() {
				
		//Fundo
        let fundoMenuInterno = this.add.sprite(0, 0, 'fundoMenuInterno').setDisplaySize(950,450);
        fundoMenuInterno.setOrigin(0, 0);
                
	    //Botão voltar 
		this.voltarImg = this.add.sprite(875, 25, 'botaoFechar').setDisplaySize(40, 40);
		this.voltarImg.setInteractive();
		this.voltarImg.on('pointerdown', function () {
			
			atualizaDados();
     		this.scene.sleep('menuInterno');  
     		
	    	 if (tipo==0){
	        	this.scene.run('girino');
	        }else if (tipo==1){
	    	    this.scene.run('sapo');   		
	        }
	    	   
		}, this);

	    //Imagens
        let logo = this.add.image(this.sys.game.config.width / 2, 100,'logo');
        this.salvar = this.add.image(this.sys.game.config.width / 2, 240,'salvar').setInteractive();               
        this.pausar = this.add.image(this.sys.game.config.width / 2, 315, 'pausar').setInteractive();        
        this.reiniciar = this.add.image(this.sys.game.config.width / 2, 405,'reiniciar').setInteractive();

        this.salvar.setDisplaySize(255,75);
        this.pausar.setDisplaySize(258,75);
        this.reiniciar.setDisplaySize(250,90);
        
      //Botao Salvar
        this.salvar.on('pointerdown', function () {
        	
        	//Chama a função para atualizar o banco de dados
        	atualizaDados();
        	
        	//Avisa o jogador que foi salvo
        	alert("O seu jogo foi salvo com sucesso!");
        }, this);
        
        //Botão Pausar
        this.pausar.on('pointerdown', function () {      	      
        		        	
        		//muda a variável 
        		isPaused = true;     
        		        		        			
        			//mudar botão pausar para continuar         	       
        		    var continuar = this.add.image(this.sys.game.config.width / 2, 325, 'continuar').setInteractive();
        		    continuar.setDisplaySize(250,85);
        			
        		    continuar.on('pointerdown', function (){        	         		             
         		       isPaused = false;
         		      continuar.destroy(); 
         		    });
        	      		         		       	        	          	        
        }, this);   
                
       //Botao Reiniciar       
        this.reiniciar.on('pointerdown', function () {
        	        	 
        	//Confirma se o jogador realmente quer reniciar        	
        	var decisao = confirm("Deseja reiniciar o seu jogo?");
        
        	if (decisao == true){
        		
        		//voltar as variáveis ao seu valor inicial
	        	moedas = 0;
	        	segundos = 0;
	        	minutos = 0;
	        	horas = 0;
	        	repetidor = 0;
	        	pctSaude = 100;
	        	pctDiversao = 100;
	        	pctAlimentacao = 100;
	        	
	        	//limpar o inventário
	        	
	        	atualizaDados();
	        	
	        	alert ("Todas as variáveis foram alteradas para seus valores iniciais.");
	        	     	
	        	this.scene.start('ovoDoGirino');
	        	
	        	if(tipo== 0){
	        		this.scene.stop('girino');
	        	}else if (tipo==1){
	        		this.scene.stop('sapo');
	        	}
	        	
        	}
        	
        }, this);
        
       primeiraVez = 0;    
       
      }
			
	update() {
				
		//Botao Pausar-Continuar
		 if(isPaused == false){
	        	this.pausar = this.add.image(this.sys.game.config.width / 2, 315, 'pausar').setInteractive(); 
	            this.pausar.setDisplaySize(258,75);

	            this.pausar.on('pointerdown', function () {      	      
	            		        	
	            	this.pausar.destroy();
	            	isPaused = true; 
	            		    
	            	console.log('pausar Pausar - '+isPaused);
	            	
	            }, this);    
	            
	        }
	        
	        if(isPaused == true){ 	       
	    		this.continuar = this.add.image(this.sys.game.config.width / 2, 325, 'continuar').setInteractive();
	    		this.continuar.setDisplaySize(250,85);
	    		
	    		this.continuar.on('pointerdown', function (){    
			                    		    
	       		    this.continuar.destroy(); 
	       		    isPaused = false;
	       		    
	       		    console.log('pausar Continuar - '+isPaused);
	       		    
	       		}, this);
	    		
	        }
		
		// Chama a função de pegar hora atual
		horaAtual();
	}
}

class comidasLoja extends Phaser.Scene{
	
	constructor(){
		super({ key: 'comidasLoja'});
	}
	
	preload(){
		
    	//Fundo
		this.load.image('fundoDesfocado', PATH + 'addons/jogo/imagens/fundo/fundoDesfocado.png');
    	this.load.image('retanguloFundo', PATH + 'addons/jogo/imagens/fundo/retanguloAzul.png');
    	
		//imagens dos produtos - Comidas
		this.load.image('agua', PATH + 'addons/jogo/imagens/comidas/agua.png');
		this.load.image('banana', PATH + 'addons/jogo/imagens/comidas/banana.png');
		this.load.image('cenoura', PATH + 'addons/jogo/imagens/comidas/cenoura.png');
		this.load.image('cupcake', PATH + 'addons/jogo/imagens/comidas/cupcake.png');
		this.load.image('hamburguer', PATH + 'addons/jogo/imagens/comidas/hamburguer.png');
		this.load.image('maca', PATH + 'addons/jogo/imagens/comidas/maca.png');
		this.load.image('ovoFrito', PATH + 'addons/jogo/imagens/comidas/ovoFrito.png');
		this.load.image('refrigerante', PATH + 'addons/jogo/imagens/comidas/refrigerante.png');
		this.load.image('sucoLaranja', PATH + 'addons/jogo/imagens/comidas/sucoLaranja.png');

		this.load.image('botaoFechar', PATH + 'addons/jogo/imagens/icones/botaoFechar.png');
		
		this.load.image('retanguloDinheiroLoja', PATH + 'addons/jogo/imagens/fundo/retanguloAzul.png');
		this.load.image('dinheiroLoja', PATH + 'addons/jogo/imagens/icones/dinheiro.png');
	}
	
	create(){
		
		//Fundo		
    	let fundoDesfocado = this.add.sprite(0, 0, 'fundoDesfocado').setDisplaySize(950,450);
    	fundoDesfocado.setOrigin(0,0);
    	
    	//Fundo Azul
    	let retanguloFundo = this.add.sprite(450, 225, 'retanguloFundo').setDisplaySize(807, 382);    	

	    //Botão voltar 
		this.voltarImg = this.add.sprite(875, 25, 'botaoFechar').setDisplaySize(40, 40);
		this.voltarImg.setInteractive();
		this.voltarImg.on('pointerdown', function () {

           atualizaDados();
 	       this.scene.stop('comidasLoja'); 
 	            
        	if (tipo==0){
        		this.scene.start('girino');
        	}else if (tipo==1){
 	            this.scene.start('sapo');	        		
        	}
	    	 primeiraVez = 0;                
		}, this);
    	
    	spawnX = 200;
        spawnY = 207;
		
        var dinheiro = new Array;
        for(var i = 0; i < 8; i++){
        	if( i == 4){
        		spawnY += 150;
        		spawnX = 200;
        	}
        	dinheiro[i] = this.add.sprite(spawnX, spawnY, 'dinheiroLoja').setDisplaySize(40, 25).setInteractive;
        	spawnX += 167;
        }

		spawnX = 190;
		spawnY = 200;
		
		$.ajax({
			type: "POST",
			url: PATH + "ConsultaProdutos",
			success: (lista)=>{

				//Grid 1
				this.precoHamburguer = this.add.text(188, 200, lista[0], { fontSize: '15px', fill: '#fff'});
				this.precoHamburguer.setInteractive();
				this.precoHamburguer.on('pointerdown', function () {
					if(moedas >= lista[0]){
						var comprar = confirm("Deseja mesmo comprar este item?");
						if(comprar == true){
							alert("Comida comprada com sucesso, sua alimentação aumentou !");
							moedas = moedas - lista[0];
							pctAlimentacao = parseInt(pctAlimentacao) + 10;
							atualizaDados();
							console.log(pctAlimentacao);
						}
					}else{
						alert("Você não tem dinheiro suficiente.");
					}
		        }, this);
				
				this.precoCake = this.add.text(355, 200, lista[1], { fontSize: '15px', fill: '#fff'});
				this.precoCake.setInteractive();
				this.precoCake.on('pointerdown', function () {
					if(moedas >= lista[1]){
						var comprar = confirm("Deseja mesmo comprar este item?");
						if(comprar == true){
							alert("Comida comprada com sucesso, sua alimentação aumentou !");
							moedas = moedas - lista[1];
							pctAlimentacao = parseInt(pctAlimentacao) + 10;
							atualizaDados();
							console.log(moedas);
						}
					}else{
						alert("Você não tem dinheiro suficiente.");
					}
		        }, this);
				
				this.precoMaca = this.add.text(520, 200, lista[2], { fontSize: '15px', fill: '#fff'});
				this.precoMaca.setInteractive();
				this.precoMaca.on('pointerdown', function () {
					if(moedas >= lista[2]){
						var comprar = confirm("Deseja mesmo comprar este item?");
						if(comprar == true){
							alert("Comida comprada com sucesso, sua alimentação aumentou !");
							moedas = moedas - lista[2];
							pctAlimentacao = parseInt(pctAlimentacao) + 10;
							atualizaDados();
							console.log(moedas);
						}
					}else{
						alert("Você não tem dinheiro suficiente.");
					}
		        }, this);
				
				this.precoBanana = this.add.text(689, 200, lista[3], { fontSize: '15px', fill: '#fff'});
				this.precoBanana.setInteractive();
				this.precoBanana.on('pointerdown', function () {
					if(moedas >= lista[3]){
						var comprar = confirm("Deseja mesmo comprar este item?");
						if(comprar == true){
							alert("Comida comprada com sucesso, sua alimentação aumentou !");
							moedas = moedas - lista[3];
							pctAlimentacao = parseInt(pctAlimentacao) + 10;
							atualizaDados();
							console.log(moedas);
						}
					}else{
						alert("Você não tem dinheiro suficiente.");
					}
		        }, this);
				
				
				//Grid 2
				this.precoSuco = this.add.text(188, 350, lista[4], { fontSize: '15px', fill: '#fff'});
				this.precoSuco.setInteractive();
				this.precoSuco.on('pointerdown', function () {
					if(moedas >= lista[4]){
						var comprar = confirm("Deseja mesmo comprar este item?");
						if(comprar == true){
							alert("Comida comprada com sucesso, sua alimentação aumentou !");
							moedas = moedas - lista[4];
							pctAlimentacao = parseInt(pctAlimentacao) + 5;
							atualizaDados();
							console.log(moedas);
						}
					}else{
						alert("Você não tem dinheiro suficiente.");
					}
		        }, this);
				
				this.precoAgua = this.add.text(355, 350, lista[5], { fontSize: '15px', fill: '#fff'});
				this.precoAgua.setInteractive();
				this.precoAgua.on('pointerdown', function () {
					if(moedas >= lista[5]){
						var comprar = confirm("Deseja mesmo comprar este item?");
						if(comprar == true){
							alert("Comida comprada com sucesso, sua alimentação aumentou !");
							moedas = moedas - lista[5];
							pctAlimentacao = parseInt(pctAlimentacao) + 5;
							atualizaDados();
							console.log(moedas);
						}
					}else{
						alert("Você não tem dinheiro suficiente.");
					}
		        }, this);
				
				this.precoRefri = this.add.text(520, 350, lista[6], { fontSize: '15px', fill: '#fff'});
				this.precoRefri.setInteractive();
				this.precoRefri.on('pointerdown', function () {
					if(moedas >= lista[6]){
						var comprar = confirm("Deseja mesmo comprar este item?");
						if(comprar == true){
							alert("Comida comprada com sucesso, sua alimentação aumentou !");
							moedas = moedas - lista[6];
							pctAlimentacao = parseInt(pctAlimentacao) + 5;
							atualizaDados();
							console.log(moedas);
						}
					}else{
						alert("Você não tem dinheiro suficiente.");
					}
		        }, this);
				
				this.precoCenoura = this.add.text(689, 350, lista[7], { fontSize: '15px', fill: '#fff'});
				this.precoCenoura.setInteractive();
				this.precoCenoura.on('pointerdown', function () {
					if(moedas >= lista[7]){
						var comprar = confirm("Deseja mesmo comprar este item?");
						if(comprar == true){
							alert("Comida comprada com sucesso, sua alimentação aumentou !");
							moedas = moedas - lista[7];
							pctAlimentacao = parseInt(pctAlimentacao) + 10;
							atualizaDados();
							console.log(moedas);
						}
					}else{
						alert("Você não tem dinheiro suficiente.");
					}
		        }, this);
			},
			error: function(info){
				alert("Erro ao consultar produtos da loja: "+ info.status + " - " + info.statusText);
			}
		});
 	        
 	    //Imagens dos produtos
	        let hamburguer = this.add.sprite(200,130, 'hamburguer').setDisplaySize(100,100);
	        let cupcake = this.add.sprite(365,130, 'cupcake').setDisplaySize(100,100);
	        let maca = this.add.sprite(535,140, 'maca').setDisplaySize(100,100);
	        let banana = this.add.sprite(700,140, 'banana').setDisplaySize(100,100);
	        let sucoLaranja = this.add.sprite(200,290, 'sucoLaranja').setDisplaySize(100,100);
	        let agua = this.add.sprite(365,290, 'agua').setDisplaySize(100,100);
	        let refrigerante = this.add.sprite(534,290, 'refrigerante').setDisplaySize(100,100);
	        let cenoura = this.add.sprite(707,290, 'cenoura').setDisplaySize(100,100);
	}
}

class jogoDaMemoria extends Phaser.Scene{
	
	constructor (){
		super({ key: 'jogoDaMemoria' });
	}
	
	preload(){		
		//Fundo
    	this.load.image('fundoDesfocadoMG', PATH + 'addons/jogo/imagens/fundo/fundoDesfocado.png');
    	this.load.image('retanguloFundo', PATH + 'addons/jogo/imagens/fundo/retanguloAzul.png');
    	this.load.image('botaoFechar', PATH + 'addons/jogo/imagens/icones/botaoFechar.png');
    	this.load.image('cartaInterrogacao', PATH + 'addons/jogo/imagens/cartasJogoMemoria/interrogacao.png');
    	this.load.image('carta0', PATH + 'addons/jogo/imagens/cartasJogoMemoria/carta1.png');
    	this.load.image('carta1', PATH + 'addons/jogo/imagens/cartasJogoMemoria/carta2.png');
    	this.load.image('carta2', PATH + 'addons/jogo/imagens/cartasJogoMemoria/carta3.png');
    	this.load.image('carta3', PATH + 'addons/jogo/imagens/cartasJogoMemoria/carta4.png');
    	this.load.image('carta4', PATH + 'addons/jogo/imagens/cartasJogoMemoria/carta5.png');
    	this.load.image('carta5', PATH + 'addons/jogo/imagens/cartasJogoMemoria/carta6.png');
    	this.load.image('carta6', PATH + 'addons/jogo/imagens/cartasJogoMemoria/carta7.png');
    	this.load.image('carta7', PATH + 'addons/jogo/imagens/cartasJogoMemoria/carta8.png');
    	this.load.image('reiniciar', PATH + 'addons/jogo/imagens/icones/botaoReiniciar.png');
    	this.load.image('logo', PATH + 'addons/jogo/imagens/logo/logo.png');
		this.clicks= 0 ;
		this.cartaClicada;
		this.canClick=true;
	}
	
	clica(carta){
		if(this.canClick){
			
		this.clicks++;
		carta.setTexture('carta'+carta.id);
		if(this.clicks==1){
			this.cartaClicada = carta;
		}else{
			this.canClick= false;
			setTimeout(()=>{
				
				if(carta.id!==this.cartaClicada.id){					
				carta.setTexture("cartaInterrogacao");
				this.cartaClicada.setTexture("cartaInterrogacao");
				this.clicks = 0; 
				this.canClick =true;
				}else{
					//Aqui tem que adicionar os pontos no bd
					carta.destroy();
					this.cartaClicada.destroy()
					this.clicks = 0 ;
					this.canClick=true;
				}
			},1000)
		}
		}

	}
	create(){

			spawnX = 150;
			spawnY = 75;
			
			//Fundo
	    	let fundoDesfocadoMG = this.add.sprite(0, 0, 'fundoDesfocadoMG').setDisplaySize(950,450);
	    	fundoDesfocadoMG.setOrigin(0,0);
	    	
	    	//Fundo Jogo da Velha
	    	let retanguloFundo = this.add.sprite(455, 223, 'retanguloFundo').setDisplaySize(935, 470);  
	    	
	    	this.logo = this.add.image(770, 210,'logo');
	    	this.logo.setDisplaySize(210,90);
	    	
	    	//Botão voltar 
 	        this.voltarImg = this.add.sprite(884, 25, 'botaoFechar').setDisplaySize(40, 40);
 	        this.voltarImg.setInteractive();
 	        this.voltarImg.on('pointerdown', function () {
 	        	
 	        	if (tipo==0){
 	        		this.scene.start('girino');
 	        	}else{
 	 	            this.scene.start('sapo');
 	 	            this.scene.stop('jogoDaMemoria'); 
 	        	}
 	        	primeiraVez = 0;
 	        }, this);	
 	     
 	        let contadoras=[0,0,0,0,0,0,0,0]
 	       var carta = new Array;
 	       for(var i = 0; i < 16; i++){

 	 	  		if( i == 4){
 	 	  			spawnY += 100;
 	 	  			spawnX = 150;
 	 	  		}else if( i == 8){
 	 	  			spawnY += 100;
 	 	  			spawnX = 150;
 	 	  		}else if( i == 12){
 	 	  			spawnY += 100;
 	 	  			spawnX = 150;
 	 	  		} 	  	 	  		
 	  		carta[i]=null
 	  		carta[i] = this.add.sprite(spawnX, spawnY, 'cartaInterrogacao').setDisplaySize(120, 100).setInteractive();
 	  		carta[i].on('pointerdown',function(){
 	  			this.scene.clica(this);
 	  		})
 	  		do{
 	  			
 	  		var numeroSorteado = Math.floor(Math.random() * (8 - 1 + 1)) ;
 	  		if(contadoras[numeroSorteado]<2){
 	  		
 	  		carta[i].id = numeroSorteado;
 	  		contadoras[numeroSorteado]++;
 	  		
 	  		
 	  		}else{
 	  			carta[i].id = undefined;
 	  		}
 	  		}while(carta[i].id==undefined);
 	  		spawnX += 145;
 	       }
 	       this.cartas = carta;
 	       
	}
	update(){
		this.ativo = false;
		for(let  i=0;i<this.cartas.length;i++ ){
			if(this.cartas[i].active==true){
				this.ativo = true;
			}
		}
		if(!this.ativo&&this.reiniciar == undefined){
			this.logo.destroy();
			this.reiniciar = this.add.sprite(475, 275, 'reiniciar').setInteractive();
			this.reiniciar.setDisplaySize(250,90);
			this.reiniciar.on('pointerdown',()=>{
				this.scene.restart();
			});
			this.mensagemGanhou = this.add.text(160, 150, 'Parabéns você concluiu o jogo da memória e ganhou 100 de dinheiro !', { fontSize: '30px', fill: '#fff'});
			this.mensagemGanhou.setWordWrapWidth(700);
			
			moedas = parseInt(moedas) + 100;
			
			pctDiversao = parseInt(pctDiversao) + 25;
			
			atualizaDados();
		}
	}

}	

//Função para atualizar as Moedas
atualizarMoedas = function (){
	
	$.ajax({
		type: "POST",
		url: PATH + "ConsultaVivos",
		success: function(sapo){
			
			moedas = sapo.moedas;
			
			qntDinheiro.setText(moedas);
			
		},
		error: function(info){
			alert("Erro ao consultar as moedas do sapo: "+ info.status + " - " + info.statusText);
		}
	});	
}

//Função para iniciar cena Ovo
chamaOvo = function (){
	
	game.scene.start('ovoDoGirino');
	
}

//Função para iniciar cena Girino
chamaGirino = function (){
	
	game.scene.start('girino');
	
}

// Função para iniciar cena Sapo
chamaSapo = function (){
	
	game.scene.stop('girino');
	game.scene.start('sapo');
		
	atualizaDados();
	
}

atualizaDados = function(){
		 
		$.ajax({
		type: "POST",
		url: PATH + "ConsultaVivos",
		success: function(sapo){
			if (sapo.status == 0 ){
				$.ajax({
					type: "POST",
					url: PATH + "AtualizaDados",
					data: "diversao="+pctDiversao+"&alimentacao="+pctAlimentacao+"&limpeza="+pctSaude+"&tempo="+horas+":"+minutos+":"+segundos+ "&moedas="+moedas+"&status=0&pontuacao=0&pontuacaoTotal=0&pontuacaoMaior=0",
					success: function(sapo){
						
					},
					error: function(info){
						alert("Erro ao atualizar os dados do sapo: "+ info.status + " - " + info.statusText);
					}
				});
			}else if(sapo.status == 1){
				$.ajax({
					type: "POST",
					url: PATH + "AtualizaDados",
					data: "diversao="+pctDiversao+"&alimentacao="+pctAlimentacao+"&limpeza="+pctSaude+"&tempo="+horas+":"+minutos+":"+segundos+ "&moedas="+moedas+"&status=1&pontuacao="+pontuacao+"&pontuacaoTotal=0&pontuacaoMaior=0",
					success: function(sapo){
						
					},
					error: function(info){
						alert("Erro ao atualizar os dados do sapo: "+ info.status + " - " + info.statusText);
					}
				});
			}	
			
		},
		error: function(info){
			alert("Erro ao consultar a porcentagem das barrinhas do sapo: "+ info.status + " - " + info.statusText);
		}
	});
		
}

// Função para pegar hora atual
horaAtual = function(){
	
	// Obtém a hora atual
	var data = new Date();
	var hora = data.getHours();// 0h-23h
	
	return hora;
}

// Função para tempo
relogio = function(){
				
	if(this.intervalo == undefined){
		this.intervalo = setInterval(function(){
			if(segundos == 59){
				repetidor++;
				minutos++;
				segundos=0;
				
				//barinhas alimentação e diversão
				pctAlimentacao = pctAlimentacao - 1;
				pctDiversao = pctDiversao - 1;
				
				console.log("D "+pctDiversao);
				console.log("S "+pctSaude);
				console.log("A "+pctAlimentacao);

				//barinha de saúde/limpeza			
				if(minutos > 0){
					confTempo = minutos%2;			
					
					if(confTempo == 0){
						 pctSaude = pctSaude - 10;							 					       
											 
					 }
				}
				
			}
					
			if(repetidor == 5){
				atualizaDados();
				repetidor = 0;
			}

			if(minutos == 60){
				horas++;
				minutos=0;
			}	
						
			//Botão Pausar
			if(isPaused == false){				
				segundos++;
				//console.log(horas+":"+minutos+":"+segundos);
			}			
		},1000);	
	}	
				
}

var config = {
	type: Phaser.AUTO,
	width: 950,
	height: 450,
	backgroundColor: '#000',
	parent: "telaJogo",
	scene: [menuInicial , ajuda, ovoDoGirino, girino, sapo, menuInterno, comidasLoja, jogoDaMemoria]
};

var game = new Phaser.Game(config);