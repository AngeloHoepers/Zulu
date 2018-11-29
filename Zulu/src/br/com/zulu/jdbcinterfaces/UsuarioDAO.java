package br.com.zulu.jdbcinterfaces;

import java.util.List;

import br.com.zulu.classes.Usuario;

public interface UsuarioDAO {

	public boolean inserir(Usuario usuario);
	public boolean inserirAdmin(Usuario usuario);
	public Usuario buscarPorLogin(String login);
	public Usuario buscarAdmin(String login);
	public Usuario buscarJogador(String login);
	public boolean atualizar(Usuario usuario);
	//public boolean deletar(String usuario);
	public List<Usuario> buscarRankingMaior();
	public List<Usuario> buscarRankingTotal();
	public boolean recuperarSenha(String login, String senha);
	public List<Integer> buscarIdade();

}
