package br.com.zulu.servlets;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCUsuarioDAO;
import br.com.zulu.classes.Usuario;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@WebServlet("/RecuperaSenha")
public class RecuperaSenha extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public RecuperaSenha() {
        super();
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	
    	Random gerador = new Random();
    	String senha = "";
    	int n;
    	
    	for(int i = 0; i < 10; i++) {
    		n = gerador.nextInt(10);
    		
    		switch (n){
    			case 0:
    				senha += "3";
    			break;
    			case 1:
    				senha += "A";
    			break;
    			case 2:
    				senha += "5";
    			break;
    			case 3:
    				senha += "d";
    			break;
    			case 4:
    				senha += "9";
    			break;
    			case 5:
    				senha += "K";
    			break;
    			case 6:
    				senha += "4";
    			break;
    			case 7:
    				senha += "r";
    			break;
    			case 8:
    				senha += "6";
    			break;
    			case 9:
    				senha += "W";
    			break;
    		}
    	}
    	
    	System.out.println(senha);
    	
        Properties props = new Properties();
        /** Parâmetros de conexão com servidor Gmail */
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "587");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.starttls.enable", "true");
 
        Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
        	protected PasswordAuthentication getPasswordAuthentication() {
        		return new PasswordAuthentication("suporte.zulu@gmail.com", "#A12#B02");
            }
        });
        /** Ativa Debug para sessão */
        session.setDebug(true);
        Map<String, String> msg = new HashMap<String, String>();
        
        Conexao conec = new Conexao();
		Connection conexao = conec.abrirConexao();
		JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
		Usuario usuariobd = jdbcUsuario.buscarJogador(request.getParameter("login"));
		String login = request.getParameter("login");
		
		jdbcUsuario.recuperarSenha(login, senha);
		
		System.out.println(senha);
        
        try {
        	Message message = new MimeMessage(session);
        	message.setFrom(new InternetAddress("suporte.zulu@gmail.com")); //Remetente
        	if(request.getParameter("login").equals(usuariobd.getLogin())) {
        		if (request.getParameter("email").equals(usuariobd.getEmail())) {
        			Address[] toUser = InternetAddress.parse(request.getParameter("email")); //Destinatário(s)
                	message.setRecipients(Message.RecipientType.TO, toUser);
                	message.setSubject("Email para recuperar senha!");//Assunto
                	message.setText("Esta é sua nova senha: "+ senha);
                	/**Método para enviar a mensagem criada*/
                	Transport.send(message);
                	System.out.println("Feito!");
                	msg.put("msg", "E-mail enviado com sucesso!");
        		} else {
	    			msg.put("msg", "Esse e-mail não existe.");
	    			msg.put("erro", "true");
	    		}
        	}	else {	
	    		msg.put("msg", "Esse usuário não existe.");
	    		msg.put("erro", "true");
    		}	
        	conec.fecharConexao();
        	
        } catch (MessagingException e) {
        	throw new RuntimeException(e);
        }
        
        String json = new Gson().toJson(msg);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
	}
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		process(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		process(request, response);
	}

}
