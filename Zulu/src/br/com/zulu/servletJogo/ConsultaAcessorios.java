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

import br.com.zulu.classes.Inventario;
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCSapoDAO;

@WebServlet("/ConsultaAcessorios")
public class ConsultaAcessorios extends HttpServlet {
	private static final long serialVersionUID = 1L;
     
    public ConsultaAcessorios() {
        super();
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	List<Inventario> inv = new ArrayList<Inventario>();
    	
    	int idSapo = Integer.parseInt(request.getParameter("idSapo"));
    	
    	Conexao conec = new Conexao();
    	Connection conexao = conec.abrirConexao();
    	JDBCSapoDAO jdbcSapo = new JDBCSapoDAO(conexao);
    	inv = jdbcSapo.consultaAcessorios(idSapo);;
    	conec.fecharConexao();
    	
    	String json = new Gson().toJson(inv);
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
