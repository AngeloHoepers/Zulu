package br.com.zulu.servletJogo;

import java.io.IOException;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

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

@WebServlet("/AtualizaDados")
public class AtualizaDados extends HttpServlet {
	private static final long serialVersionUID = 1L;

    
    public AtualizaDados() {
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	Sapo sapo = new Sapo();
    	
    	try {
    		
    		Conexao conec = new Conexao();    		 		
    		Connection conexao = conec.abrirConexao();
    		HttpSession sessao = request.getSession();
    		
    		JDBCSapoDAO jdbcSapo = new JDBCSapoDAO(conexao);
    		
    		int diversao = Integer.parseInt(request.getParameter("diversao"));
    		int alimentacao = Integer.parseInt(request.getParameter("alimentacao")); 
    		int limpeza = Integer.parseInt(request.getParameter("limpeza")); 
    		int status = Integer.parseInt(request.getParameter("status"));
    		
    		if((diversao > 100)||(diversao < 0)&&(status==0)) {
    			diversao = 100;
    		}
    		
    		if((alimentacao > 100)||(alimentacao < 0)&&(status==0)) {
    			alimentacao = 100;
    		}
    		
    		if((limpeza > 100)||(limpeza < 0)&&(status==0)) {
    			limpeza = 100;
    		}
    		
    		sapo.setLogin(sessao.getAttribute("login").toString());
    		sapo.setDiversao(diversao);
    		sapo.setAlimentacao(alimentacao);
    		sapo.setLimpeza(limpeza);
    		sapo.setTempo(request.getParameter("tempo"));
    		sapo.setMoedas(request.getParameter("moedas"));
    		sapo.setStatus(status);
    		sapo.setPontuacao(request.getParameter("pontuacao"));
    		sapo.setPontosTotal(request.getParameter("pontuacaoTotal"));
    		sapo.setPontosMaior(request.getParameter("pontuacaoMaior"));
    		
    		boolean coisasSapo = jdbcSapo.atualizarDados(sapo);
    		
    		Map<String, String> msg = new HashMap<String, String>();
    		
    		conec.fecharConexao();
    		
    		System.out.println(msg);
	    	System.out.println(coisasSapo);
	    	
    		String json = new Gson().toJson(coisasSapo);
    		
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
