var exec = require("child_process").exec;

var path = '"/home/pvieira/clima-madeira/shapes cirac/Indice-de-Vulnerabilidade-Combinado/normal/cirac_vul_bgri_cfvi.shp"';
var command = 'shp2pgsql -D -I -s 4326 ' + path + '  geo.cirac_vul_bgri_cfvi_com_d2   |  psql --dbname=150310';


var cb = function(err, stdout, stderr){
	if(err){
		throw err;
	}
	console.log("stdout: \n", stdout);
	console.log("stderr: \n", stderr);
}
exec(command, cb);


/*
Output will be:

stdout:  
SET
SET
BEGIN
CREATE TABLE
ALTER TABLE
                            addgeometrycolumn                            
-------------------------------------------------------------------------
 geo.cirac_vul_bgri_cfvi_com_d2.geom SRID:4326 TYPE:MULTIPOLYGON DIMS:2 
(1 row)

COPY 170145   <- number of rows in the table
CREATE INDEX
COMMIT

stderr:  
Shapefile type: Polygon
Postgis type: MULTIPOLYGON[2]


*/