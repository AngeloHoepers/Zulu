package br.com.zulu.classes;

import java.io.Serializable;
//import java.text.SimpleDateFormat;
//import java.util.Date;

public class Sapo implements Serializable{

	private static final long serialVersionUID = 1L;	
	private String login;
	private int id;
	private int diversao;
	private int alimentacao;
	private int limpeza;
	private String tempo;
	private String moedas;
	private int status;
	private String pontuacao;
	private String pontosMaior;
	private String pontosTotal;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public int getDiversao() {
		return diversao;
	}
	public void setDiversao(int diversao) {
		this.diversao = diversao;
	}
	
	public int getAlimentacao() {
		return alimentacao;
	}
	public void setAlimentacao(int alimentacao) {
		this.alimentacao = alimentacao;
	}
	
	public int getLimpeza() {
		return limpeza;
	}
	public void setLimpeza(int limpeza) {
		this.limpeza = limpeza;
	}
	
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	
	public String getMoedas() {
		return moedas;
	}
	public void setMoedas(String moedas) {
		this.moedas = moedas;
	}
		
	public String getTempo() {
		return tempo;
	}
	public void setTempo(String tempo) {
		this.tempo = tempo;
	}
	
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	public String getPontuacao() {
		return pontuacao;
	}
	public void setPontuacao(String pontuacao) {
		this.pontuacao = pontuacao;
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
	
}
