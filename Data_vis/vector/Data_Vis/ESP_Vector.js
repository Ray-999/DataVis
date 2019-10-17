requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        /////////////////////////////////////////////

        // Tell WorldWind to log only warnings and errors.
        // WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        const wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        const layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (let l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }
        /////////////////////////////////////////////

        const pLayer = new WorldWind.RenderableLayer("ESP visualization");

        //Placemark attributes
        const pAttributes = new WorldWind.PlacemarkAttributes(null);
        pAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 0.0);
        pAttributes.imageScale = 0.06;
        pAttributes.labelAttributes.color = WorldWind.Color.BLACK;
        pAttributes.labelAttributes.scale = 0;
        pAttributes.labelAttributes.outlineWidth = 0.1;
        pAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);

        //////////////////////////////////////////////

        $.ajax({
            url: "http://localhost:6969/ESP",
            method: "get",
            success: function(resp){
                 const number = resp.length;
                 for(let i = 0; i < number; i++){
                     pmCreator(resp[i].Latitude, resp[i].Longitude);
        }
            }
        });

        //Image of placemark
        pAttributes.imageSource = WorldWind.configuration.baseUrl + "/data/ycircle.png";

        const pmCreator = function (lat, long, state, city) {

            //position of placemark
        const position = new WorldWind.Position(lat, long, 1);

        const pMark = new WorldWind.Placemark(position, true, pAttributes);

        //Placemark label
        pMark.alwaysOnTop = true;
        pMark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

        //Add placemark
        pLayer.addRenderable(pMark);

        };

        //Add to World Window
        wwd.addLayer(pLayer);

        $(document).ready(function(){
                $('[data-toggle="popover"]').popover("hide");
            });

        //Modal popup function
        const placeClick = function(a) {
            //Performs the pick
            const x = a.clientX,
                  y = a.clientY;
            const pickList = wwd.pick(wwd.canvasCoordinates(x, y));

            for (let p = 0; p < pickList.objects.length; p++) {
                if (pickList.objects[p].userObject instanceof WorldWind.Placemark) {
                    var dataSent = JSON.parse(JSON.stringify(pickList.objects[p].userObject.position));

                    $.ajax({
                        url: "http://localhost:6969/ESP2",
                        data: dataSent,
                        method: "get",
                        success: function (resp) {
                            const number = resp.length;
                            const title = document.getElementById("location_info");
                            for(let i = 0; i < number; i++){
                                let state = resp[i].State;
                                let city = resp[i].City;
                                title.innerHTML = state + ", " + city;
                            }
                        }
                    });

                    //Open modal when placemark is clicked
                    const modal = document.getElementById('myModal');
                    modal.style.display = "block";

                    // When the user clicks anywhere outside of the modal, close it
                    window.onclick = function (event) {
                        const modal = document.getElementById('myModal');

                        if (event.target === modal) {
                            modal.style.display = "none";
                        }
                    };

                }
            }
        };
        wwd.addEventListener("click", placeClick);

        // Create a layer manager for controlling layer visibility.
        const layerManager = new LayerManager(wwd);
    });