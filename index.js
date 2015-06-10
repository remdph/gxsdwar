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
var archiver = require('archiver');

var warPath = "./ctithelper.war";
var warPathNew = "./ctithelper.war";
var envPath = "/Program Files/Apache Software Foundation/Tomcat 7.0/webapps/CTIThelperJavaEnvironment";

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

              //Preparar Nuevo WEB.INF

              console.log("> Crear nuevo contenedor WAR...");

              var output = fs.createWriteStream(warPathNew);
              var archive = archiver('zip');

              output.on('close', function () {
                console.log("[COMPLETADO]".green);
                console.log("[Proceso finalizado]".yellow);
              });

              archive.on('error', function(err){
                console.log("[ERROR] Fallo comprimiendo WAR");
              })

              archive.pipe(output);
              archive.bulk([
                  { expand: true, cwd: './tmp/', src: ['**'], dest: '/'}
              ]);
              archive.finalize();

              console.log("> Comprimiendo...");

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
