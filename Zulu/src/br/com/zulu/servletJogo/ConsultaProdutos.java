package br.com.zulu.servletJogo;

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

import br.com.zulu.classes.Sapo;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCSapoDAO;

@WebServlet("/ConsultaProdutos")
public class ConsultaProdutos extends HttpServlet {
	private static final long serialVersionUID = 1L;
     
    public ConsultaProdutos() {
        super();
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	List<Integer> sapos = new ArrayList<Integer>();
    	
    	//Chamar o método que busca os usuarios do banco de dados
    	Conexao conec = new Conexao();
    	Connection conexao = conec.abrirConexao();
    	JDBCSapoDAO jdbcSapo = new JDBCSapoDAO(conexao);
    	sapos = jdbcSapo.tabelaProdutos();
    	conec.fecharConexao();
    	
    	//Para retornar um objeto para o usuário
    	String json = new Gson().toJson(sapos);
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
