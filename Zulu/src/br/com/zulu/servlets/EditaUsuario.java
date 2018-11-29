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

import com.google.gson.Gson;

import br.com.zulu.classes.Criptografia;
import br.com.zulu.classes.Usuario;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCUsuarioDAO;

@WebServlet("/EditaUsuario")
public class EditaUsuario extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public EditaUsuario() {
        super();
    }

    private void process(HttpServletRequest request, HttpServletResponse response) 
    		throws ServletException, IOException {
    	try {
    		
    		int permissao;
    		boolean retorno;
    		Conexao conec = new Conexao();
    		Connection conexao = conec.abrirConexao();
    		JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
    		Usuario usuariobd = jdbcUsuario.buscarJogador(request.getParameter("login"));
    		permissao = 1;
    		System.out.println(request.getParameter("login"));
    		if(usuariobd.getLogin()==null){
    			usuariobd = jdbcUsuario.buscarAdmin(request.getParameter("login"));
    			permissao = 0;
    			System.out.println("Entrei aqui");
    		}
    		Map<String, String> msg = new HashMap<String, String>();
    		if (request.getParameter("login").equals(usuariobd.getLogin())) {
    			String senhaAtualCript = Criptografia.criptografaSenha(request.getParameter("senha")); 
    			if (senhaAtualCript.equals(usuariobd.getSenha())) {
    				Usuario usuario = new Usuario();
    	    		usuario.setLogin(request.getParameter("login"));
    	    		usuario.setPermissao(request.getParameter("permissao"));
    	    		usuario.setNome(request.getParameter("nome"));
    	    		usuario.setNascimento(request.getParameter("nascimento"));
    	    		usuario.setEmail(request.getParameter("email"));
    	    		
    	    		if(request.getParameter("senhanova").equals("")){
    	    			usuario.setSenha(request.getParameter("senha"));
    	    		}else {
    	    			usuario.setSenha(request.getParameter("senhanova"));
    	    		}
    	    		
    	    		if(permissao == 0) {
    	    			retorno = jdbcUsuario.atualizarAdmin(usuario);
    	    		} else {
    	    			retorno = jdbcUsuario.atualizar(usuario); 
    	    		} 
    		    	
    		    	if (retorno) {
    		    		msg.put("msg", "Usuário editado com sucesso.");
    		    	} else {
    		    		msg.put("msg", "Não foi possível editar o usuário.");
    		    		msg.put("erro", "true");
    		    	}
	    		} else {
	    			msg.put("msg", "Senha não corresponde com o cadastro.");
	    			msg.put("erro", "true");
	    		}
    		} else {	
	    		msg.put("msg", "Você não pode alterar seu usuário.");
	    		msg.put("erro", "true");
    		}	
    		conec.fecharConexao();
    		
    		response.setContentType("application/json");
    	   	response.setCharacterEncoding("UTF-8");
    	   	response.getWriter().write(new Gson().toJson(msg));
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
