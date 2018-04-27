-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema ISfinal
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ISfinal
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ISfinal` DEFAULT CHARACTER SET utf8 ;
USE `ISfinal` ;

-- -----------------------------------------------------
-- Table `ISfinal`.`Artigos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ISfinal`.`Artigos` (
  `idArtigos` INT NOT NULL,
  `titulo` VARCHAR(145) NOT NULL,
  `ano` INT NOT NULL,
  `localpub` VARCHAR(200) NOT NULL,
  `scopus` VARCHAR(200) NOT NULL,
  `wos` VARCHAR(200) NOT NULL,
  `dblp` VARCHAR(200) NOT NULL,
  `issn` VARCHAR(200) NOT NULL,
  `scop16` VARCHAR(200) NULL,
  `scop17` VARCHAR(200) NULL,
  `scop18` VARCHAR(200) NULL,
  `totalscop` INT NOT NULL,
  `sjr` VARCHAR(200) NULL,
  PRIMARY KEY (`idArtigos`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ISfinal`.`Orcid`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ISfinal`.`Orcid` (
  `idOrcid` INT NOT NULL,
  PRIMARY KEY (`idOrcid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ISfinal`.`Orcid_has_Artigos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ISfinal`.`Orcid_has_Artigos` (
  `idOrcid` INT NOT NULL,
  `idArtigos` INT NOT NULL,
  PRIMARY KEY (`idOrcid`, `idArtigos`),
  INDEX `fk_Orcid_has_Artigos_Artigos1_idx` (`idArtigos` ASC),
  INDEX `fk_Orcid_has_Artigos_Orcid_idx` (`idOrcid` ASC),
  CONSTRAINT `fk_Orcid_has_Artigos_Orcid`
    FOREIGN KEY (`idOrcid`)
    REFERENCES `ISfinal`.`Orcid` (`idOrcid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Orcid_has_Artigos_Artigos1`
    FOREIGN KEY (`idArtigos`)
    REFERENCES `ISfinal`.`Artigos` (`idArtigos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;