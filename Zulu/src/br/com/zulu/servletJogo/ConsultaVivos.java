package br.com.zulu.servletJogo;

import java.io.IOException;
import java.sql.Connection;
//import java.util.ArrayList;
//import java.util.List;





import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import br.com.zulu.classes.Sapo;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCSapoDAO;

@WebServlet("/ConsultaVivos")
public class ConsultaVivos extends HttpServlet {
	private static final long serialVersionUID = 1L;
     
    public ConsultaVivos() {
        super();
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	Sapo sapo = new Sapo();
    	
    	HttpSession sessao = request.getSession();
    	
    	//Chamar o método que busca os usuarios do banco de dados
    	Conexao conec = new Conexao();
    	Connection conexao = conec.abrirConexao();
    	JDBCSapoDAO jdbcSapo = new JDBCSapoDAO(conexao);
    	sapo = jdbcSapo.buscarPorLogin(sessao.getAttribute("login").toString());
    	if(sapo.getTempo()!=null){
    		
	    	String tempo = sapo.getTempo();
	    	
	    	String[] tempoRecebido = tempo.split(":");
			String tempoConvertido = tempoRecebido[0] + ":" + tempoRecebido[1] + ":" + tempoRecebido[2];
	    }
    
    	conec.fecharConexao();    	
   
    	//Para retornar um objeto para o usuário
    	String json = new Gson().toJson(sapo);
    	try {
    		response.setContentType("application/json");
    		response.setCharacterEncoding("UTF-8");
    		response.getWriter().write(json);
    	} catch (IOException e) {
    		e.printStackTrace();
    	}
    }
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		process(request, response);	
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		process(request, response);
	}

}
