package br.com.zulu.servletJogo;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import br.com.zulu.classes.Sapo;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCSapoDAO;

import com.google.gson.Gson;

@WebServlet("/InsereSapos")
public class InsereSapos extends HttpServlet {
	private static final long serialVersionUID = 1L;

    
    public InsereSapos() {
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	Sapo sapo = new Sapo();
    	
    	try {
    		
    		Conexao conec = new Conexao();    		
//    		Date data = new Date();    		
    		Connection conexao = conec.abrirConexao();
    		HttpSession sessao = request.getSession();
    		
    		JDBCSapoDAO jdbcSapo = new JDBCSapoDAO(conexao);

    		sapo.setLogin(sessao.getAttribute("login").toString());
    		sapo.setDiversao(100);
    		sapo.setAlimentacao(100);
    		sapo.setLimpeza(100);
    		sapo.setTempo("0");
    		sapo.setMoedas("0");
    		sapo.setStatus(0);
    		sapo.setPontuacao("0");
    		sapo.setPontosTotal("0");
    		sapo.setPontosMaior("0");
    		
    		int sapoId = jdbcSapo.inserirSapo(sapo);
    		
    		sapo.setId(sapoId);
    
    		
    		conec.fecharConexao();
    		
    		String json = new Gson().toJson(sapo);
    		
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
