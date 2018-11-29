package br.com.zulu.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import br.com.zulu.classes.Criptografia;
import br.com.zulu.classes.Usuario;
import br.com.zulu.jdbcinterfaces.UsuarioDAO;

public class JDBCUsuarioDAO implements UsuarioDAO {

	private Connection conexao;

	public JDBCUsuarioDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public boolean inserir(Usuario usuario) {
		
		String comando = "INSERT INTO jogadores (usuario, senha, permissao, nome, data_de_nascimento, email, data_cadastro, idade) VALUES (?,?,?,?,?,?,?,?)";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, usuario.getLogin());
			p.setString(2, Criptografia.criptografaSenha(usuario.getSenha()));
			p.setString(3, usuario.getPermissao());
			p.setString(4, usuario.getNome());
			p.setString(5, usuario.getNascimento());
			p.setString(6, usuario.getEmail());
			p.setString(7, usuario.getDataCadastro());
			p.setString(8, usuario.getIdade());
			p.execute();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public boolean inserirAdmin(Usuario usuario) {
		
		String comando = "INSERT INTO administradores (usuario, senha, permissao, nome, data_de_nascimento, email) VALUES (?,?,?,?,?,?)";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, usuario.getLogin());
			p.setString(2, Criptografia.criptografaSenha(usuario.getSenha()));
			p.setString(3, usuario.getPermissao());
			p.setString(4, usuario.getNome());
			p.setString(5, usuario.getNascimento());
			p.setString(6, usuario.getEmail());
			p.execute();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public Usuario buscarPorLogin(String login) {
		
		String comando = "SELECT * FROM jogadores WHERE usuario = '" + login + "'";
		Usuario usuario = new Usuario();
		try {
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				String nome = rs.getString("nome");
				String nascimento = usuario.converteNascimentoParaFrontend(rs.getString("data_de_nascimento"));
				String email = rs.getString("email");
				String senha = rs.getString("senha");
				String permissao = rs.getString("permissao");
				
		        usuario.setLogin(login);
		        usuario.setSenha(senha);
		        usuario.setPermissao(permissao);
		        usuario.setNome(nome);
		        usuario.setNascimento(nascimento);
		        usuario.setEmail(email);
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return usuario;
	}
	
	public List<Usuario> buscarRankingMaior() {
		
		String comando = "SELECT MAX(pontuacao) as pontos, jogadores_usuario FROM `sapos` WHERE `status`=1 Group By jogadores_usuario Order By pontos DESC";
		
		System.out.println(comando);
		List<Usuario> listUsuario = new ArrayList<Usuario>();
		Usuario usuario = null;
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				usuario = new Usuario();
				String login = rs.getString("jogadores_usuario");				
				String pontosMaior = rs.getString("pontos");
				
		        usuario.setLogin(login);
		        usuario.setPontosMaior(pontosMaior);
								
				listUsuario.add(usuario);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return listUsuario;
	}
	
	public List<Usuario> buscarRankingTotal() {
		
		String comando = "SELECT sum(pontuacao) as pontos, jogadores_usuario FROM `sapos` WHERE `status`=1 Group By jogadores_usuario Order By pontos DESC";
		
		System.out.println(comando);
		List<Usuario> listUsuario = new ArrayList<Usuario>();
		Usuario usuario = null;
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				usuario = new Usuario();
				String login = rs.getString("jogadores_usuario");				
				String pontosTotal = rs.getString("pontos");
				
		        usuario.setLogin(login);
		        usuario.setPontosTotal(pontosTotal);
								
				listUsuario.add(usuario);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return listUsuario;
	}
	
	public List<Integer> buscarIdade() {
		
		String comando = "SELECT idade FROM jogadores";
		
		System.out.println(comando);
		
		List<Integer> age = new ArrayList<Integer>();
		
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
		
				age.add(rs.getInt("idade"));
		
								

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return age;
	}
	
	public List<Usuario> tabelaJogador() {
		String comando = "SELECT * FROM jogadores ";
		System.out.println(comando);
		List<Usuario> listUsuario = new ArrayList<Usuario>();
		Usuario usuario = null;
		try {
			Statement stmt = conexao.createStatement(); 
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				usuario = new Usuario();
				String login = rs.getString("usuario");
				String nome = rs.getString("nome");
				String nascimento = usuario.converteNascimentoParaFrontend(rs.getString("data_de_nascimento"));
				String email = rs.getString("email");
				String senha = rs.getString("senha");
				String permissao = rs.getString("permissao");
				
		        usuario.setLogin(login);
		        usuario.setNome(nome);
		        usuario.setNascimento(nascimento);
		        usuario.setEmail(email);
		        usuario.setSenha(senha);
		        usuario.setPermissao(permissao);
		          				
				listUsuario.add(usuario);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return listUsuario;
	}
	
	public Usuario buscarJogador(String login) {
		
		String comando = "SELECT * FROM jogadores WHERE usuario = '" + login + "'";
		Usuario usuario = new Usuario();
		try {
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				String nome = rs.getString("nome");
				String nascimento = usuario.converteNascimentoParaFrontend(rs.getString("data_de_nascimento"));
				String email = rs.getString("email");
				String senha = rs.getString("senha");
				String permissao = rs.getString("permissao");
				
				usuario.setLogin(login);
				usuario.setNome(nome);
				usuario.setNascimento(nascimento);
				usuario.setEmail(email);
				usuario.setSenha(senha);
		        usuario.setPermissao(permissao);		        
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return usuario;
	}
	
	public int buscarQuantidadeJogador() {
			
			String comando = "SELECT COUNT(*) AS quantidade FROM jogadores";
			//Usuario usuario = new Usuario();
			int retorno = 0;
			try {
				java.sql.Statement stmt = conexao.createStatement();
				ResultSet rs = stmt.executeQuery(comando);
				while (rs.next()) {
					
					retorno = rs.getInt("quantidade");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			return retorno;
	}
	
	public Usuario buscarAdmin(String login) {
		
		String comando = "SELECT * FROM administradores WHERE usuario = '" + login + "'";
		Usuario usuario = new Usuario();
		try {
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()) {
				String nome = rs.getString("nome");
				String nascimento = usuario.converteNascimentoParaFrontend(rs.getString("data_de_nascimento"));
				String email = rs.getString("email");
				String senha = rs.getString("senha");
				String permissao = rs.getString("permissao");
				
		        usuario.setLogin(login);
		        usuario.setNome(nome);
		        usuario.setNascimento(nascimento);
		        usuario.setEmail(email);
		        usuario.setSenha(senha);      
		        usuario.setPermissao(permissao);
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return usuario;
	}

	public boolean recuperarSenha(String login, String senha) {
		
		String comando = "UPDATE jogadores SET senha=?";
		comando += " WHERE usuario=?";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, Criptografia.criptografaSenha(senha));
			p.setString(2, login);
			p.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public boolean atualizar(Usuario usuario) {
		
		String comando = "UPDATE jogadores SET senha=?, nome=?, data_de_nascimento=?, email=?";
		comando += " WHERE usuario=?";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, Criptografia.criptografaSenha(usuario.getSenha()));
			p.setString(2, usuario.getNome());
			p.setString(3, usuario.getNascimento());
			p.setString(4, usuario.getEmail());
			p.setString(5, usuario.getLogin());
			p.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public boolean atualizarAdmin(Usuario usuario) {
		
		String comando = "UPDATE administradores SET senha=?, nome=?, data_de_nascimento=?, email=?";
		comando += " WHERE usuario=?";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, Criptografia.criptografaSenha(usuario.getSenha()));
			p.setString(2, usuario.getNome());
			p.setString(3, usuario.getNascimento());
			p.setString(4, usuario.getEmail());
			p.setString(5, usuario.getLogin());
			p.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/*public boolean deletar(String usuario) {
		String comando = "DELETE FROM jogadores WHERE usuario = '" + usuario +"'";
		Statement p;
		try {
			p = this.conexao.createStatement();
			p.execute(comando);
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}*/
	
}
