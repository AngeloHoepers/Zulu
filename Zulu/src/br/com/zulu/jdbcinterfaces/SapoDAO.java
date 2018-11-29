package br.com.zulu.jdbcinterfaces;

//import java.util.List;

import java.util.List;

import br.com.zulu.classes.Sapo;

public interface SapoDAO {

	public Sapo buscarPorLogin(String login);
	
	public List<Integer> tabelaProdutos();
	//public List<Integer> consultaItem(idSapo);

}
