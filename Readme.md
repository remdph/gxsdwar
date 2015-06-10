# Patch para Java Deployment for Smart Devices (SD) para contenedor WAR generado con Genexus EVO2 y EVO3

Patch para Java Deployment for Smart Devices (SD) para contenedor WAR generado con Genexus EVO2 y EVO3.

Agrega objetos, librerias y recursos faltantes para hacer un deployment correcto de los servicios REST necesarios para que Aplicaciones SD funcionen correctamente.

## Instalación

`npm install gxsdwar -g`

## Uso

`gxsdwar [pathToWarFile] [pathToJavaWevApp]`

## Ejemplo

`gxsdwar gxfile.war "/Program Files/Apache Software Foundation/Tomcat 7.0/webapps/test/"`
