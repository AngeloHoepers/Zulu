package br.com.zulu.servlets;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import br.com.zulu.classes.Usuario;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCUsuarioDAO;

@WebServlet("/ValidaSessao")
public class ValidaSessao extends HttpServlet {
	private static final long serialVersionUID = 1L;
     
    public ValidaSessao() {
        super();
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	System.out.println("validando sessão");
    	try {
    		HttpSession sessao = request.getSession();
    		
    		if (request.getParameter("p").equals(sessao.getAttribute("permissao"))) {
    			System.out.println("sessão OK");
    			Conexao conec = new Conexao();
        		Connection conexao = conec.abrirConexao();
        		JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao); 
        		Usuario usuario = new Usuario();
        		
        		if(request.getParameter("p").equals("0")){
        			usuario = jdbcUsuario.buscarAdmin(sessao.getAttribute("login").toString());
        		}else{
        			usuario = jdbcUsuario.buscarPorLogin(sessao.getAttribute("login").toString());
        		}
        		
        		conec.fecharConexao();
        		
        		String json = new Gson().toJson(usuario);
            	response.setContentType("application/json");
            	response.setCharacterEncoding("UTF-8");
            	response.getWriter().write(json);
            	
    		} else {
    			System.out.println("página:"+request.getParameter("p")+" e sessão:"+sessao.getAttribute("permissao"));
    		}
    			

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
