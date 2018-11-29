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
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import br.com.zulu.classes.Criptografia;
import br.com.zulu.classes.Usuario;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCUsuarioDAO;

@WebServlet("/Login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public Login() {
        super();
    }

    private void process(HttpServletRequest request, HttpServletResponse response) 
    		throws ServletException, IOException {
    	try {
    		Conexao conec = new Conexao();
    		Connection conexao = conec.abrirConexao();
    		JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
    		
    		Usuario usuario = jdbcUsuario.buscarPorLogin(request.getParameter("login"));
    		if(usuario.getLogin()== null){
    			usuario = jdbcUsuario.buscarAdmin(request.getParameter("login"));
    		}
    		Map<String, String> msg = new HashMap<String, String>();
    		if (request.getParameter("login").equals(usuario.getLogin())) {
    			String senhaFormCript = Criptografia.criptografaSenha(request.getParameter("senha")); 
    			if (senhaFormCript.equals(usuario.getSenha())) {
    				HttpSession sessao = request.getSession();
    				sessao.setAttribute("login", usuario.getLogin());
    				sessao.setAttribute("permissao", usuario.getPermissao());
    				if(sessao.getAttribute("permissao").equals("0")) {
    					System.out.println("admin logando");
    					msg.put("url", "paginas/admin/index.html");
    				} else {    					
    					System.out.println("player logando");
    					msg.put("url", "paginas/jogador/index.html");
    				}
	    		} else {
	    			//System.out.println("form: "+senhaFormCript+" e bd:"+usuario.getSenha());
	    			msg.put("msg", "Senha não corresponde com o cadastro.");
	    		}
    		} else {	
	    		msg.put("msg", "Usuário não encontrado.");
    		}	
    		conec.fecharConexao();
    		
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
