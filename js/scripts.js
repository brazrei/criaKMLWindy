var inicio = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:ns2="http://www.google.com/kml/ext/2.2" xmlns:ns3="http://www.w3.org/2005/Atom" xmlns:ns4="urn:oasis:names:tc:ciq:xsdschema:xAL:2.0"><Document><Folder><name>ICA:fir</name><Placemark id="fir.fid-6491349e_1752c4a5e31_6c8a"><name>Personalizada</name><description></description><Style><LabelStyle><color>32000000</color><scale>1.0</scale></LabelStyle><LineStyle><color>ffffffff</color><width>0.66</width></LineStyle><PolyStyle><color>00000000</color></PolyStyle></Style><MultiGeometry><Polygon><outerBoundaryIs><LinearRing><tessellate>1</tessellate><coordinates>'
var fim = '</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry></Placemark></Folder></Document></kml>'
function clearCoords(c) {
//  var c = $('#ta1').val().toUpperCase();
  c = c.replace(/ /g,'').replace(/LAT/g,'').replace(/LONG/g,'').replace(/\//g,'').replace(/-/g,'').replace(/;/g,'').replace(/\W/g, '')
  console.log(c)
  return c;
}

function skyVectorToRedemet(coords) {
    //console.log(coords)
    let latLngPatt1 = /\d{6}[nNsS]\d{7}[WwEe]/g
    let latLngPatt2 = /\d{4}[nNsS]\d{5}[WwEe]/g

    let arrCoords = coords.match(latLngPatt1)

    if (!arrCoords || (arrCoords.length == 0)) {
        arrCoords = coords.match(latLngPatt2)
        if (!arrCoords || (arrCoords.length == 0))
            return coords
    }

    for (let i in arrCoords) {
        let icoord = arrCoords[i]
        let sepLat = "S"
        if (icoord.includes("N"))
            sepLat = "N"
            
        let sepLon = "W"
        if (icoord.includes("E"))
            sepLon = "E"
            
        let ilat = icoord.split(sepLat)[0].substr(0, 4)
        let ilong = icoord.split(sepLat)[1].substr(0, 5)
        arrCoords[i] = sepLat + ilat + " " + sepLon + ilong

    }
    if (arrCoords[0] !== arrCoords[arrCoords.length - 1])
        arrCoords.push(arrCoords[0])
    return arrCoords.join(" - ")

}


function converteLat(lat){
    let sinal = lat[0]=='S'?-1:1;
    let graus = parseInt(lat[1] + lat[2])
  
    let minutos = lat[3] + lat[4]
    minutos = minutos/60
    return sinal * (graus + minutos)
  }
  
  function converteLong(long){
    let sinal = long[0]=='W'?-1:1;
    let graus = parseInt(long[1] + long[2] + long[3])
  
    let minutos = long[4] + long[5]
    minutos = minutos/60
    return sinal * (graus + minutos)
  }
  
  function formataCoords() {
    let coords = $("#edtCoords").val();
    
    coords = coords.replace(/[\n\r]/g, ' ');
  
    while (coords.includes("      "))
      coords = coords.replace("     ", '');
  
    while (coords.includes("= "))
      coords = coords.replace(/= /g, '=');
    coords = coords.replace(/=/gm, "=\n");
    while (coords.includes("  "))
      coords = coords.replace("  ", ' ');
    coords = coords.trimStart();
  
    coords = skyVectorToRedemet(clearCoords(coords.replace(/W/g," W").replace(/E/g," E")))
      
    coords = coords.replace(/[^a-z0-9]/gi,'').replace(/S/g, " - S").replace(/N/g, " - N")
    coords = coords[0] == " "? coords.slice(3) : coords
    $('#spanCoords').html("Coordenadas extraídas do texto: " + coords)
    coords = coords.split(' - ')
    let coordsSaida = ''
    for (let i in coords){
      coords[i] = coords[i].replace(/[^a-z0-9]/gi,'').replace(/W/g," W").replace(/E/g," E");
      let lat = coords[i].split(' ')[0]
      let long = coords[i].split(' ')[1]
      coordsSaida += converteLong(long) + ',' + converteLat(lat) + ' '
    }
      
    
    console.log(coordsSaida)
    $("#edtCoords").val(inicio+coordsSaida+fim);
  
   $("#edtCoords").select();
   //document.execCommand('copy');

   download()
  }

  function download(){
    var text = document.getElementById("edtCoords").value;
    text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    var blob = new Blob([text], { type: "text/plain"});
    var anchor = document.createElement("a");
    anchor.download = "Area.kml";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
   }


  
  function automatico () {
  //setTimeout(formataCoords, 1000);
  }
  
  //formataCoords("S0547 W05051 - S0601 W04806 - S0701 W04652 - S0526 W04526 - S0329 W04612 - S0344 W05052 - S0547 W05051")
