package br.com.zulu.servlets;

import java.io.IOException;
import java.sql.Connection;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCUsuarioDAO;

import com.google.gson.Gson;

/**
 * Servlet implementation class ConsultaQuantidadeJogadores
 */
@WebServlet("/ConsultaQuantidadeJogadores")
public class ConsultaQuantidadeJogadores extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ConsultaQuantidadeJogadores() {
        super();
        
    }
    
    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	    	
    	//Chamar o método que busca os usuarios do banco de dados
    	Conexao conec = new Conexao();
    	Connection conexao = conec.abrirConexao();
    	//Usuario usuario = new Usuario();
    	JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
    	int retorno = jdbcUsuario.buscarQuantidadeJogador();
    	conec.fecharConexao();
    	
    	//Para retornar um objeto para o usuário
    	String json = new Gson().toJson(retorno);
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
