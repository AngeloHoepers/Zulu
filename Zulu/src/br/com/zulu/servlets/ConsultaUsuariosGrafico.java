package br.com.zulu.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCUsuarioDAO;

/**
 * Servlet implementation class ConsultaUsuarios
 */
@WebServlet("/ConsultaUsuariosGrafico")
public class ConsultaUsuariosGrafico extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ConsultaUsuariosGrafico() {
        super();
        // TODO Auto-generated constructor stub
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	List<Integer> usuarios = new ArrayList<Integer>();
    	
    	//Chamar o método que busca os usuarios do banco de dados
    	Conexao conec = new Conexao();
    	Connection conexao = conec.abrirConexao();
    	JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
    	usuarios = jdbcUsuario.buscarIdade();
    	conec.fecharConexao();
    	
    	//Para retornar um objeto para o usuário
    	String json = new Gson().toJson(usuarios);
    	try {
    		response.setContentType("application/json");
    		response.setCharacterEncoding("UTF-8");
    		response.getWriter().write(json);
    	} catch (IOException e) {
    		e.printStackTrace();
    	}
    }
    
    /**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		process(request, response);	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		process(request, response);
	}

}
