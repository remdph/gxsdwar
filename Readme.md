# Patch para Java Deployment for Smart Devices (SD) para contenedor WAR generado con Genexus EVO2 y EVO3

Patch para Java Deployment for Smart Devices (SD) para contenedor WAR generado con Genexus EVO2 y EVO3.

Agrega objetos, librerias y recursos faltantes para hacer un deployment correcto de los servicios REST necesarios para que Aplicaciones SD funcionen correctamente.

## Instalación

`npm install gxsdwar`

## Configuración
Antes de proceder con el re-ensamblado debe editar el archivo "conf.json" ubicado en la carpeta raiz del proyecto.

### Estructura de conf.json
```
{
  "warFile": "[pathToWar]", //path del archivo WAR generado con GeneXus
  "appPath": "[pathToAppJava]", //path hacia la APP del deployment local hecho por genexus en tomcat (o equivalente)
  "jdkPath": "[pathToJavaJDK]" //path a JDK de java
}
```

### Ejemplo
```
{
  "warFile": "./test.war",
  "appPath": "/Program Files/Apache Software Foundation/Tomcat 7.0/webapps/test",
  "jdkPath": "/Program Files/Java/jdk1.7.0_75"
}
```

## Uso

`node gxsdwar`
