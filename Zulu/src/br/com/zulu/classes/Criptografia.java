package br.com.zulu.classes;

import java.security.MessageDigest;

public class Criptografia {
	
	static public String criptografaSenha(String senha) {
		String senhaCript = "";
		try {
			MessageDigest algorithm = MessageDigest.getInstance("MD5");
			byte messageDigest[] = algorithm.digest(senha.getBytes("UTF-8"));
			 
			StringBuilder hexString = new StringBuilder();
			for (byte b : messageDigest) {
			  hexString.append(String.format("%02X", 0xFF & b));
			}
			senhaCript = hexString.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return senhaCript;
	}
	

}
