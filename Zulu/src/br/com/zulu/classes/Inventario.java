package br.com.zulu.classes;

import java.io.Serializable;
//import java.text.SimpleDateFormat;
//import java.util.Date;

public class Inventario implements Serializable{

	private static final long serialVersionUID = 1L;	
	private int sapo_id;
	private int codigo;
	private int status;
	private int quantidade;
	
	public int getId() {
		return sapo_id;
	}
	public void setId(int sapo_id) {
		this.sapo_id = sapo_id;
	}
	
	public int getCodigo() {
		return codigo;
	}
	public void setCodigo(int codigo) {
		this.codigo = codigo;
	}
	
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	public int getQuantidade() {
		return quantidade;
	}
	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}
	
}
