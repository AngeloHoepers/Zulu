-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Tempo de geração: 27/11/2018 às 19:56
-- Versão do servidor: 5.7.11-log
-- Versão do PHP: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";




/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bd_zulu`
--
CREATE DATABASE IF NOT EXISTS `bd_zulu` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `bd_zulu`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `administradores`
--

CREATE TABLE `administradores` (
  `usuario` varchar(45) NOT NULL,
  `senha` char(32) NOT NULL,
  `nome` varchar(55) NOT NULL,
  `email` varchar(80) NOT NULL,
  `data_de_nascimento` date NOT NULL,
  `permissao` int(1) UNSIGNED NOT NULL COMMENT '0 - ADMIN\n1 - JOGADOR'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='	';

--
-- Fazendo dump de dados para tabela `administradores`
--

INSERT INTO `administradores` (`usuario`, `senha`, `nome`, `email`, `data_de_nascimento`, `permissao`) VALUES
('admin', 'CAF1A3DFB505FFED0D024130F58C5CFA', 'admin', 'admin@gmail.com', '2018-08-01', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `entradas`
--

CREATE TABLE `entradas` (
  `id` int(4) UNSIGNED ZEROFILL NOT NULL,
  `data` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `jogadores_usuario` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `jogadores`
--

CREATE TABLE `jogadores` (
  `usuario` varchar(45) NOT NULL,
  `senha` char(32) NOT NULL,
  `nome` varchar(55) NOT NULL,
  `email` varchar(80) NOT NULL,
  `data_cadastro` date NOT NULL,
  `data_de_nascimento` date NOT NULL,
  `permissao` int(1) UNSIGNED NOT NULL COMMENT '0 - ADMIN\n1 - JOGADOR',
  `idade` int(2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

CREATE TABLE `produtos` (
  `codigo` int(3) UNSIGNED ZEROFILL NOT NULL,
  `categoria` varchar(25) NOT NULL,
  `name` varchar(55) NOT NULL,
  `preco` int(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Fazendo dump de dados para tabela `produtos`
--

INSERT INTO `produtos` (`codigo`, `categoria`, `name`, `preco`) VALUES
(016, 'Comidas', 'X-Burguer', 125),
(017, 'Comidas', 'Bolo', 115),
(018, 'Comidas', 'Maçã', 110),
(019, 'Comidas', 'Banana', 110),
(020, 'Comidas', 'Suco', 115),
(021, 'Comidas', 'Água', 110),
(022, 'Comidas', 'Refrigerante', 120),
(023, 'Comidas', 'Cenoura', 110);

-- --------------------------------------------------------

--
-- Estrutura para tabela `sapos`
--

CREATE TABLE `sapos` (
  `id` int(4) UNSIGNED ZEROFILL NOT NULL,
  `diversao` tinyint(3) UNSIGNED NOT NULL,
  `alimentacao` tinyint(3) UNSIGNED NOT NULL,
  `limpeza` tinyint(3) UNSIGNED NOT NULL,
  `tempo` time NOT NULL,
  `moedas` int(5) UNSIGNED NOT NULL,
  `status` int(1) UNSIGNED NOT NULL COMMENT '0 = Vivo\n1 = Morto\n',
  `jogadores_usuario` varchar(45) NOT NULL,
  `pontuacao` int(7) UNSIGNED NOT NULL,
  `pontuacaoTotal` int(7) UNSIGNED NOT NULL,
  `pontuacaoMaior` int(7) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sapos_has_produtos`
--

CREATE TABLE `sapos_has_produtos` (
  `sapos_id` int(4) UNSIGNED ZEROFILL NOT NULL,
  `produtos_codigo` int(3) UNSIGNED ZEROFILL NOT NULL,
  `status` int(1) UNSIGNED NOT NULL COMMENT '0 = equipado\n1 = desequipado',
  `quantidade` int(2) UNSIGNED NOT NULL COMMENT 'somente quando for comida a quantidade poderá ser maior que 1.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`usuario`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- Índices de tabela `entradas`
--
ALTER TABLE `entradas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_entradas_jogadores1_idx` (`jogadores_usuario`);

--
-- Índices de tabela `jogadores`
--
ALTER TABLE `jogadores`
  ADD PRIMARY KEY (`usuario`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- Índices de tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`codigo`);

--
-- Índices de tabela `sapos`
--
ALTER TABLE `sapos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sapos_jogadores1_idx` (`jogadores_usuario`);

--
-- Índices de tabela `sapos_has_produtos`
--
ALTER TABLE `sapos_has_produtos`
  ADD PRIMARY KEY (`sapos_id`,`produtos_codigo`),
  ADD KEY `fk_sapos_has_produtos_produtos1_idx` (`produtos_codigo`),
  ADD KEY `fk_sapos_has_produtos_sapos_idx` (`sapos_id`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `entradas`
--
ALTER TABLE `entradas`
  MODIFY `id` int(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `codigo` int(3) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT de tabela `sapos`
--
ALTER TABLE `sapos`
  MODIFY `id` int(4) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `entradas`
--
ALTER TABLE `entradas`
  ADD CONSTRAINT `fk_entradas_jogadores1` FOREIGN KEY (`jogadores_usuario`) REFERENCES `jogadores` (`usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `sapos`
--
ALTER TABLE `sapos`
  ADD CONSTRAINT `fk_sapos_jogadores1` FOREIGN KEY (`jogadores_usuario`) REFERENCES `jogadores` (`usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `sapos_has_produtos`
--
ALTER TABLE `sapos_has_produtos`
  ADD CONSTRAINT `fk_sapos_has_produtos_produtos1` FOREIGN KEY (`produtos_codigo`) REFERENCES `produtos` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_sapos_has_produtos_sapos` FOREIGN KEY (`sapos_id`) REFERENCES `sapos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
