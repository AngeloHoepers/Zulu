package br.com.zulu.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;



import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.com.zulu.classes.Usuario;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCUsuarioDAO;

import com.google.gson.Gson;

@WebServlet("/InsereAdmin")
public class InsereAdmin extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public InsereAdmin() { 
    }

    private void process(HttpServletRequest request, HttpServletResponse response) 
    		throws ServletException, IOException {
    	
    	Usuario usuario = new Usuario();
    	
    	try {
    		
    		usuario.setNome(request.getParameter("txtNome"));
    		usuario.setEmail(request.getParameter("txtEmail"));
    		usuario.setNascimento(request.getParameter("dateDataDeNascimento"));
    		usuario.setLogin(request.getParameter("txtUsuario"));
    		usuario.setSenha(request.getParameter("pwdSenha"));
    		usuario.setPermissao(request.getParameter("hdPermissao"));
    		Conexao conec = new Conexao();
    		Connection conexao = conec.abrirConexao();
    		JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
    		Usuario usuariobd = jdbcUsuario.buscarPorLogin(usuario.getLogin());
    		Map<String, String> msg = new HashMap<String, String>();
    		if (usuario.getLogin().equals(usuariobd.getLogin())) {
    			msg.put("msg", "Esse login já existe.");
    		} else {	
	    		boolean retorno = jdbcUsuario.inserirAdmin(usuario);
	    		if (retorno) {
	    			msg.put("msg", "Usuário cadastrado com sucesso.");
	    		} else {
	    			msg.put("msg", "Não foi possível cadastrar o usuário.");
	    		}
    		}	
    		conec.fecharConexao();
	    	System.out.println(msg);
    		String json = new Gson().toJson(msg);
    		
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
