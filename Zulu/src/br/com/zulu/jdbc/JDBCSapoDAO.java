package br.com.zulu.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
//import java.util.ArrayList;
//import java.util.List;


import java.util.ArrayList;
import java.util.List;
import br.com.zulu.classes.Inventario;
import br.com.zulu.classes.Sapo;
import br.com.zulu.classes.Usuario;
//import br.com.zulu.classes.Usuario;
import br.com.zulu.jdbcinterfaces.SapoDAO;

public class JDBCSapoDAO implements SapoDAO {

	private Connection conexao;

	public JDBCSapoDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public Sapo buscarPorLogin(String login) {
		
		String comando = "SELECT * FROM sapos WHERE jogadores_usuario = '" + login + "'";
		Sapo sapo = new Sapo();
		
		System.out.println(comando);
		try {
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				
				int id = rs.getInt("id");
				int diversao = rs.getInt("diversao");
				int alimentacao = rs.getInt("alimentacao");
				int limpeza = rs.getInt("limpeza");
				String tempo = rs.getString("tempo");
				String moedas = rs.getString("moedas");
				int status = rs.getInt("status");
				String jogadores_usuario = rs.getString("jogadores_usuario");
				String pontuacao = rs.getString("pontuacao");
				String pontuacaoTotal = rs.getString("pontuacaoTotal");
				String pontuacaoMaior = rs.getString("pontuacaoMaior");
				
				sapo.setId(id);
				sapo.setDiversao(diversao);
				sapo.setAlimentacao(alimentacao);
				sapo.setLimpeza(limpeza);
				sapo.setTempo(tempo);
				sapo.setMoedas(moedas);
				sapo.setStatus(status);
				sapo.setLogin(jogadores_usuario);
				sapo.setPontuacao(pontuacao);
				sapo.setPontosTotal(pontuacaoTotal);
				sapo.setPontosMaior(pontuacaoMaior);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return sapo;
	}
	
	public List<Integer> tabelaProdutos() {
		String comando = "SELECT * FROM produtos";
		System.out.println(comando);
		List<Integer> listaProdutos = new ArrayList<Integer>();
		
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				
				listaProdutos.add(rs.getInt("preco"));


			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return listaProdutos;
	}
	
	public boolean atualizarDados(Sapo sapo) {
		
		String comando = "UPDATE sapos SET diversao=?, alimentacao=?, limpeza=?, tempo=?, moedas=?, status=?, pontuacao=?, pontuacaoTotal=?, pontuacaoMaior=?";
		comando += " WHERE jogadores_usuario=? AND status=0";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, sapo.getDiversao());
			p.setInt(2, sapo.getAlimentacao());
			p.setInt(3, sapo.getLimpeza());
			p.setString(4, sapo.getTempo());
			p.setString(5, sapo.getMoedas());
			p.setInt(6, sapo.getStatus());
			p.setString(7, sapo.getPontuacao());
			p.setString(8, sapo.getPontosTotal());
			p.setString(9, sapo.getPontosMaior());
			p.setString(10, sapo.getLogin());
			p.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public List<Integer> consultaItem(int sapoId) {
		String comando = "SELECT * FROM sapos_has_produtos WHERE sapos_id= '"+ sapoId + "'";
		System.out.println(comando);
		List<Integer> listaInventario = new ArrayList<Integer>();
		
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				
				listaInventario.add(rs.getInt("produtos_codigo"));


			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return listaInventario;
	}
	
	public int consultaQuantidade(int sapoId, int produtoCodigo) {
		String comando = "SELECT quantidade FROM sapos_has_produtos WHERE sapos_id= '"+ sapoId + "' AND produtos_codigo= '"+produtoCodigo+"' ";
		System.out.println(comando);
		int quantidade=0;
		
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				
				quantidade = (rs.getInt("quantidade"));

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return quantidade;
	}
	
	public boolean atualizarQuantidade(Inventario inv) {
		
		String comando = "UPDATE sapos_has_produtos SET quantidade=?";
		comando += " WHERE sapos_id=? AND produtos_codigo=?";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, inv.getQuantidade());
			p.setInt(2, inv.getId());
			p.setInt(3, inv.getCodigo());

			p.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public boolean inserirItem(Inventario inv) {
		
		String comando = "INSERT INTO sapos_has_produtos (sapos_id, produtos_codigo, status, quantidade) VALUES (?,?,?,?)";
		PreparedStatement p;
		
		System.out.println(comando);
		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, inv.getId());
			p.setInt(2, inv.getCodigo());
			p.setInt(3, inv.getStatus());
			p.setInt(4, inv.getQuantidade());
			p.execute();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public boolean inserirComida(int idSapo) {
		
		String comando = "UPDATE jogadores SET senha=1";
		comando += " WHERE usuario=?";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, idSapo);
			p.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public int inserirSapo(Sapo sapo) {
		
		String comando = "INSERT INTO sapos (jogadores_usuario, diversao, alimentacao, limpeza, tempo, moedas, status, pontuacao, pontuacaoTotal, pontuacaoMaior) VALUES (?,?,?,?,?,?,?,?,?,?)";
		PreparedStatement p;
		int sapoId = 0;
		
		try {
			p = this.conexao.prepareStatement(comando, Statement.RETURN_GENERATED_KEYS);
			p.setString(1, sapo.getLogin());
			p.setInt(2, sapo.getDiversao());
			p.setInt(3, sapo.getAlimentacao());
			p.setInt(4, sapo.getLimpeza());
			p.setString(5, sapo.getTempo());
			p.setString(6, sapo.getMoedas());
			p.setInt(7, sapo.getStatus());
			p.setString(8, sapo.getPontuacao());
			p.setString(9, sapo.getPontosTotal());
			p.setString(10, sapo.getPontosMaior());
			
			p.executeUpdate();
			
			ResultSet rs = p.getGeneratedKeys();
			if(rs.next()){
				sapoId = rs.getInt(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();	
		}
		return sapoId;
	}
	
	public List<Inventario> consultaInventario(int sapoId) {
		
		String comando = "SELECT * FROM sapos_has_produtos WHERE sapos_id= '"+ sapoId + "'" ;
		
		System.out.println(comando);
		List<Inventario> listInventario = new ArrayList<Inventario>();
		Inventario inv = null;
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				inv = new Inventario();
				int codigo = rs.getInt("produtos_codigo");				
				int status = rs.getInt("status");
				int quantidade = rs.getInt("quantidade");
				
				inv.setId(sapoId);
		        inv.setCodigo(codigo);
		        inv.setStatus(status);
		        inv.setQuantidade(quantidade);
								
		        listInventario.add(inv);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return listInventario;
	}
	
	public List<Inventario> consultaAcessorios(int idSapo) {
		String comando = "SELECT * FROM sapos_has_produtos WHERE sapos_id= '"+idSapo+"' AND produtos_codigo >= 1 AND produtos_codigo <= 9";
		System.out.println(comando);
		List<Inventario> listInventario = new ArrayList<Inventario>();
		Inventario inv = null;
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				inv = new Inventario();
				int codigo = rs.getInt("produtos_codigo");				
				int status = rs.getInt("status");
				int quantidade = rs.getInt("quantidade");
				
				inv.setId(idSapo);
		        inv.setCodigo(codigo);
		        inv.setStatus(status);
		        inv.setQuantidade(quantidade);
								
		        listInventario.add(inv);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return listInventario;
	}
	
//	public Sapo buscarJogador(String login) {
//		
//		String comando = "SELECT * FROM jogadores WHERE usuario = '" + login + "'";
//		Sapo sapo = new Sapo();
//		try {
//			java.sql.Statement stmt = conexao.createStatement();
//			ResultSet rs = stmt.executeQuery(comando);
//			while (rs.next()) {
//				String nome = rs.getString("nome");
//				String nascimento = usuario.converteNascimentoParaFrontend(rs.getString("data_de_nascimento"));
//				String email = rs.getString("email");
//				String senha = rs.getString("senha");
//				String permissao = rs.getString("permissao");
//				
//				usuario.setLogin(login);
//				usuario.setNome(nome);
//				usuario.setNascimento(nascimento);
//				usuario.setEmail(email);
//				usuario.setSenha(senha);
//		        usuario.setPermissao(permissao);		        
//				
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return sapo;
//	}
	
}
