/*!
 * gxsdwar
 * Copyright(c) 2015 Rafael Maldonado <remdph@gmail.com>
 * Creative Commons Licensed
 *
 * @gxsdwar
 * Genera contenedor WAR para Servicios REST de Smart Devices generados con Genexus EVO2 y EVO3 para Java.
 */

var Admzip = require('adm-zip');
var mkdirp = require('mkdirp');
var fs = require('fs');
var ncp = require('ncp').ncp;
var colors = require('colors');
var rmdir = require( 'rmdir' );
var onlyPath = require('path').dirname;
var config = JSON.parse(fs.readFileSync("./conf.json"));

var warPath = config.warFile;
var warPathNew = config.warFile;
var envPath = config.appPath;
var jdkPath = config.jdkPath;

console.log("[Proceso Iniciado]".yellow);
console.log("> Extrayendo WAR...");

try{
  var zip = new Admzip(warPath);

  zip.extractAllTo("./tmp/",true);

  console.log("[COMPLETADO]".green);
  console.log("> Preparando temporal...");

  ncp.clobber = true;
  ncp.limit = 100;

  rmdir("./tmp/Metadata/",function(err,dirs,files){
    rmdir("./tmp/gxmetadata/",function(err,dirs,files){
      mkdirp("./tmp/Metadata/TableAccess",function(err){});
      mkdirp("./tmp/gxmetadata/",function(err){});

      console.log("[COMPLETADO]".green);
      console.log("> Copiando /Metadata/...");

      ncp(envPath+"/Metadata/","./tmp/Metadata/",function(err){
        if(err){
          return console.log("[ERROR] Directorio no encontrado o sin permisos".red);
        }

        console.log("[COMPLETADO]".green);

        console.log("> Copiando /gxmetadata/...");

        ncp(envPath+"/gxmetadata/","./tmp/gxmetadata/",function(err){
          if(err){
            console.log(err);
            return console.log("[ERROR] Directorio no encontrado o sin permisos".red);
          }

          console.log("[COMPLETADO]".green);
          console.log("> Copiando Librerias JARs a /WEB-INF/lib...");

          ncp(envPath+"/WEB-INF/lib/","./tmp/WEB-INF/lib/",function(err){
            if(err){
              console.log(err);
              return console.log("[ERROR] Directorio no encontrado o sin permisos".red);
            }

            console.log("[COMPLETADO]".green);
            console.log("> Copiando Archivos .class faltantes...");

            ncp(envPath+"/WEB-INF/classes/","./tmp/WEB-INF/classes/",function(err){
              if(err){
                console.log(err);
                return console.log("[ERROR] Directorio no encontrado o sin permisos".red);
              }

              console.log("[COMPLETADO]".green);
              console.log("> Reconstruyendo Manifiesto WEB.INF...");

              ncp(envPath+"/WEB-INF/web.xml","./temp/WEB-INF/web.xml",function(err){
                
                console.log("[COMPLETADO]".green);
                console.log("> Crear nuevo contenedor WAR...");

                var exec = require('child_process').exec;

                console.log("> Comprimiendo...");

                exec('build.bat '+warPathNew+' "'+jdkPath+'"', function(error, stdout, stderr) {

                  if (error !== null) {
                    console.log("[ERROR] Ocurrio un problema generando WAR, detalle: ");
                    console.log(error);
                  }else{
                    console.log("[COMPLETADO]".green);
                    console.log("[Proceso finalizado]".yellow);
                  }
                });
              });
            });
          });
        });
      });
    });
  });
}catch(e){
  var desc = e+"";

  if(desc == "Invalid filename") console.log("[ERROR] Archivo WAR no soportado".red);

  console.log("[Finalizado con errores]".red);
  console.log(e);
}
