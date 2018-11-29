package br.com.zulu.servletJogo;

import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.com.zulu.classes.Inventario;
/*import br.com.zulu.classes.Sapo;
import br.com.zulu.classes.Usuario;*/
import br.com.zulu.conexao.Conexao;
import br.com.zulu.jdbc.JDBCSapoDAO;

import com.google.gson.Gson;

@WebServlet("/InsereProdutoInventario")
public class InsereProdutoInventario extends HttpServlet {
	private static final long serialVersionUID = 1L;

    
    public InsereProdutoInventario() {
    }

    private void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	Inventario inv = new Inventario();
    	
    	try {
    		
    		Conexao conec = new Conexao();    		    		
    		Connection conexao = conec.abrirConexao();
    		
    		Map<String, String> msg = new HashMap<String, String>();
    		
    		JDBCSapoDAO jdbcSapo = new JDBCSapoDAO(conexao);
    		
    		boolean comida = Boolean.parseBoolean(request.getParameter("comida"));
    		int codigo = Integer.parseInt(request.getParameter("codigo"));
    		int idSapo = Integer.parseInt(request.getParameter("idSapo"));
    		
    		if(comida == true){
    			
    			List<Integer> possuirItem = new ArrayList<Integer>();
        		
        		possuirItem = jdbcSapo.consultaItem(idSapo);
        		
        		int contadora = 0;
        		
        		//inv.setQuantidade(1);
        		
        		for(Integer i : possuirItem){
        			if(codigo == i){
        				int quantidade = jdbcSapo.consultaQuantidade(idSapo, codigo);
        				quantidade = quantidade + 1;
        				System.out.println(quantidade);
        				inv.setQuantidade(quantidade);
        				inv.setId(idSapo);
        				inv.setCodigo(codigo);
        				
        				boolean retorno = jdbcSapo.atualizarQuantidade(inv);
                		if (retorno) {
                			msg.put("msg", "Item comprado com sucesso.");
                		} else {
                			msg.put("msg", "Não foi possível comprar o item.");
                		}
        			}else{
        				contadora++;
        			}
        			
        		}
        		
        		if(possuirItem.size() == contadora){
        			System.out.println("entrou");
        			inv.setId(idSapo);
            		inv.setCodigo(Integer.parseInt(request.getParameter("codigo")));
            		inv.setStatus(1);
            		inv.setQuantidade(1);

            		boolean retorno = jdbcSapo.inserirItem(inv);
            		if (retorno) {
            			msg.put("msg", "Item comprado com sucesso.");
            		} else {
            			msg.put("msg", "Não foi possível comprar o item.");
            		}
        		}
        		
    		}else{
    			
    			List<Integer> possuirItem = new ArrayList<Integer>();
        		
        		possuirItem = jdbcSapo.consultaItem(idSapo);
        		
        		int contadora = 0;
        		
        		for(Integer i : possuirItem){
        			if(codigo == i){
        				msg.put("msg", "Você já possui o item.");
        			}else{
        				contadora++;
        			}
        			
        		}
        		
        		if(possuirItem.size() == contadora){
        			inv.setId(idSapo);
            		inv.setCodigo(Integer.parseInt(request.getParameter("codigo")));
            		inv.setStatus(1);
            		inv.setQuantidade(1);

            		boolean retorno = jdbcSapo.inserirItem(inv);
            		if (retorno) {
            			msg.put("msg", "Item comprado com sucesso.");
            		} else {
            			msg.put("msg", "Não foi possível comprar o item.");
            		}
        		}
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
