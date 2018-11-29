package br.com.zulu.classes;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Usuario implements Serializable{

	private static final long serialVersionUID = 1L;	
	private String nome;
	private String nascimento;
	private String email;
	private String login;
	private String senha;
	private String permissao;
	private String dataCadastro;
	private String idade;
	private String pontosMaior;
	private String pontosTotal;
	
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	public String getNascimento() {
		return nascimento;
	}
	public void setNascimento(String nascimento) {
		this.nascimento = nascimento;
	}
	
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	
	public String getSenha() {
		return senha;
	}
	public void setSenha(String senha) {
		this.senha = senha;
	}
	
	public String getPermissao() {
		return permissao;
	}
	public void setPermissao(String permissao) {
		this.permissao = permissao;
	}
	
	public String getDataCadastro() {
		return dataCadastro;
	}
	public void setDataCadastro(String dataCadastro) {
		this.dataCadastro = dataCadastro;
	}
		
	public String getIdade() {
		return idade;
	}
	public void setIdade(String IdadeDoJogador) {
		this.idade = IdadeDoJogador;
	}
		
	
	public String getPontosMaior() {
		return pontosMaior;
	}
	public void setPontosMaior(String pontosMaior) {
		this.pontosMaior = pontosMaior;
	}
	
	public String getPontosTotal() {
		return pontosTotal;
	}
	public void setPontosTotal(String pontosTotal) {
		this.pontosTotal = pontosTotal;
	}
	
	public String converteDataCadastro(Date data) {
		System.out.println(data+" - Data");
		SimpleDateFormat FormataData = new SimpleDateFormat("yyyy/MM/dd");
		String date = FormataData.format(data);
		System.out.println(date.toString());
		return date.toString();
	}
	
	public String converteNascimentoParaFrontend(String nascimento) {
		String[] nascimentoDividido = nascimento.split("-");
		String nascimentoConvertido = nascimentoDividido[2] + "/" + nascimentoDividido[1] + "/" + nascimentoDividido[0];
		return nascimentoConvertido;
	}
	
	public String converteNascimentoParaBD() {
		String[] nascimentoDividido = nascimento.split("/");
		String nascimentoConvertido = nascimentoDividido[2] + "-" + nascimentoDividido[1] + "-" + nascimentoDividido[0];
		return nascimentoConvertido;
	}
	
}
