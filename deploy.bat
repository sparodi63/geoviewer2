@echo off

REM  PARAMETRI 
REM   - target = PROD / STAGING
REM   - app = nome della dir della applicazione
REM     se app="LIB" viene fatto deploy della libreria
REM   UTILIZZO
REM   deploy <TARGET> <APP>
REM   deploy STAGING LIB
REM   deploy STAGING geoportale

@REM IF NOT EXIST G: net use G: \\srvcarto2.regione.liguria.it\Tomcat /user:SRVCARTO2\parodi Fr@z1one
@REM IF NOT EXIST H: net use H: \\srvcarto2.regione.liguria.it\TomcatProt /user:SRVCARTO2\parodi Fr@z1one

@REM npm run deploy %1 %2
@REM groovy deploy.groovy %1 %2
python deploy.py %*