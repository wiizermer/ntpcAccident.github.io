var map;
var SDLLayer;

function initialize() {
    var location = new google.maps.LatLng(25.0139828, 121.4886804);
    
    var mapOptions = {
        zoom: 13,
        center: location,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        keyboardShortcuts: false,
        draggable: true,
        disableDoubleClickZoom: false,
        scrollwheel: true,
        streetViewControl: true,
        mapTypeControl:false,
        /*mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId],
            position: google.maps.ControlPosition.TOP_CENTER
        }*/
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    
}




//zeru
function addLayer(type) {
            //Define custom WMS tiled layer
            SDLLayer = new google.maps.ImageMapType({
            getTileUrl: function(coord, zoom) {
                var proj = map.getProjection();
                var zfactor = Math.pow(2, zoom);

                // get Long Lat coordinates

                var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
                var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));


                //corrections for the slight shift of the SLP (mapserver)
                var deltaX = 0.0013;
                var deltaY = 0.00058;


                //create the Bounding box string
                var bbox = (top.lng() + deltaX) + "," +
                    (bot.lat() + deltaY) + "," +
                    (bot.lng() + deltaX) + "," +
                    (top.lat() + deltaY);


                //http://localhost:808/cgi-bin/mapserv.exe?MAP=C:/Users/lepton/Desktop/My Docs/Development/GIS Testing/Delhi_State_Locality.map&LAYERS=ALL&MODE=MAP
                if(type==="A1"){
                    var url = "http://demo.datarget.com.tw/geoserver/tpedot/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&VIEWPARAMS=accident_category%3AA1&STYLES=&LAYERS=tpedot%3Aaccident_view&SRS=EPSG%3A4326&WIDTH=256&HEIGHT=256&BBOX=" + bbox + "&viewparams=accident_category:A1&styles=tpedot:accident_a1"
                } else if(type==="A2"){
                    var url = "http://demo.datarget.com.tw/geoserver/tpedot/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&VIEWPARAMS=accident_category%3AA1&STYLES=&LAYERS=tpedot%3Aaccident_view&SRS=EPSG%3A4326&WIDTH=256&HEIGHT=256&BBOX=" + bbox + "&viewparams=accident_category:A2&styles=tpedot:accident_a2"
                } else if(type==="A3"){
                    var url = "http://demo.datarget.com.tw/geoserver/tpedot/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&VIEWPARAMS=accident_category%3AA1&STYLES=&LAYERS=tpedot%3Aaccident_view&SRS=EPSG%3A4326&WIDTH=256&HEIGHT=256&BBOX=" + bbox + "&viewparams=accident_category:A3&styles=tpedot:accident_a3"
                }

                return url; // return URL for the tile
            },


                tileSize: new google.maps.Size(256, 256),
                opacity: 0.8, // setting image TRANSPARENCY 
                isPng: true
            });


            //add WMS layer
            map.overlayMapTypes.push(SDLLayer);
}
function removeLayer() {
    if (SDLLayer) {
                map.overlayMapTypes.removeAt(SDLLayer);
            }
}

$(document).ready(function() {//使用jquery 當整個html document都讀完以後 在做以下的事情
    $('input:radio').change(function() {// 抓取<input>標籤 dom裡面 有radio屬性  change事件
        var isChecked = $(this).prop("checked");//得到change當下這個dom物件的 checked屬性
        var mapTypeValue = $(this).val();//得到change當下這個dom物件的 value
        console.log("isChecked=" + isChecked)

        if (isChecked) {
            if (mapTypeValue == "normal") {
                console.log("mapTypeValue=" + mapTypeValue)
                map.setOptions({ styles: null });
            } else if (mapTypeValue == "road") {
                console.log("mapTypeValue=" + mapTypeValue)
                var justroadStyle = [
                { "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "elementType": "geometry", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "color": "#000000" }] }, { "featureType": "landscape", "stylers": [{ "color": "#ffffff" }, { "visibility": "on" }] }
                ]
                map.setOptions({ styles: justroadStyle });
                //https://developers.google.com/maps/documentation/javascript/styling?hl=zh-tw
            } else if (mapTypeValue == "blue") {
                console.log("mapTypeValue=" + mapTypeValue)
                var blueStyle = [
                    { "featureType": "all", "stylers": [{ "saturation": 0 }, { "hue": "#e7ecf0" }] }, { "featureType": "road", "stylers": [{ "saturation": -70 }] }, { "featureType": "transit", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "stylers": [{ "visibility": "simplified" }, { "saturation": -60 }] }
                ]
                map.setOptions({ styles: blueStyle });

            }


        }
    });
    $('input:checkbox').change(function(){
        var layerIsChecked = $(this).prop("checked");//得到change當下這個dom物件的 checked屬性
        var mapLayerType = $(this).val();//得到change當下這個dom物件的 value
        console.log("isChecked=" + layerIsChecked)
 
        if (layerIsChecked) {
            if (mapLayerType == "A1") {
                console.log("mapLayerType=" + mapLayerType);
                addLayer(mapLayerType);
            } else if (mapLayerType == "A2") {
                console.log("mapLayerTypee=" + mapLayerType);
                addLayer(mapLayerType);
                
            } else if (mapLayerType == "A3") {
                console.log("mapLayerType=" + mapLayerType);
                addLayer(mapLayerType);
                
            }
        };
        if(!layerIsChecked){
            if (mapLayerType == "A1") {
                console.log("CancelmapLayerType=" + mapLayerType);
                removeLayer();
            } else if (mapLayerType == "A2") {
                console.log("CancelmapLayerType=" + mapLayerType);
                removeLayer();
            } else if (mapLayerType == "A3") {
                console.log("CancelmapLayerType=" + mapLayerType)
                removeLayer();
            }
        }
    });
    $('#clear').click(function(){
        $('input:checkbox').prop("checked",false);
        console.log("all byebye");
        map.overlayMapTypes.clear();


    })
})




