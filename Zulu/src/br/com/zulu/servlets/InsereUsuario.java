package br.com.zulu.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;
import java.util.Date;



import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.com.zulu.classes.Usuario;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCUsuarioDAO;

import com.google.gson.Gson;

@WebServlet("/InsereUsuario")
public class InsereUsuario extends HttpServlet {
	private static final long serialVersionUID = 1L;

    
    public InsereUsuario() {
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	Usuario usuario = new Usuario();
    	
    	try {
    		
    		usuario.setNome(request.getParameter("nome"));
    		usuario.setEmail(request.getParameter("email"));
    		usuario.setNascimento(request.getParameter("nascimento"));
    		usuario.setLogin(request.getParameter("login"));
    		usuario.setSenha(request.getParameter("senha"));
    		usuario.setPermissao(request.getParameter("permissao"));
    		
    		Conexao conec = new Conexao();    		
    		Date data = new Date();    		
    		Connection conexao = conec.abrirConexao();
    		
    		usuario.setDataCadastro(usuario.converteDataCadastro(data));
    		usuario.setIdade(request.getParameter("idade"));
    		
    		JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
    		Usuario usuariobd = jdbcUsuario.buscarPorLogin(usuario.getLogin());
    		
    		Map<String, String> msg = new HashMap<String, String>();
    		System.out.println(usuario.getLogin());
    		System.out.println(usuario.getEmail());    		
    		
    		if (usuario.getLogin().equals(usuariobd.getLogin()) || (usuario.getEmail().equals(usuariobd.getEmail()))) {
    			msg.put("msg", "Login e/ou Email já cadastrado.");
    		}else  {	
	    		boolean retorno = jdbcUsuario.inserir(usuario);
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
