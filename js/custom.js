/*
* MVC Components
*/
$(document).ready(function () {

    /*
    / Social share component Start
    */

    /* Social share component END */

    /*
    * Scroll to top compoment START
    */

    /* Scroll to top compoment END */

    /*
    * Store Location component START
    */
    var map,
        markers = [],
        infoWindows = [],
        trafficLayer,
        $storeLocation = $('.c-store-location');

    function drawMap(map, infowindow, openInfoWindow, addressInfo, position) {

        var marker = new google.maps.Marker({
            map: map,
            position: position
        });

        attachDescription(map, marker, addressInfo);

        // marker.addListener('click', function() {
        //     infowindow.open(map, marker);
        // });

        // if (openInfoWindow === 'true') {
        //     infowindow.open(map, marker);
        // }

        // Setting bounds
        var bounds = new google.maps.LatLngBounds();

        for (var k = 0; k < markers.length; k++) {
            bounds.extend(markers[k].getPosition());
        }

        // Fit all markers within map bounds
        markers.length ? map.fitBounds(bounds) : map.setCenter(position);

        // Adding marker to an Array to be able to clear map on Route rendering
        markers.push(marker);

        // Re-centering the map on window resize
        google.maps.event.addDomListener(window, 'resize', function () {
            map.setCenter(position);
        });
    }

    // Attaching descriptions to markers
    function attachDescription(map, marker, addressInfo) {
        var infowindow = new google.maps.InfoWindow({
            content: addressInfo
        });

        infoWindows.push(infowindow);

        marker.addListener('click', function () {
            closeAllInfoWindows();
            infowindow.open(map, marker);
        });
    }

    // Closing all infovindows if needed
    function closeAllInfoWindows() {
        for (var i = 0; i < infoWindows.length; i++) {
            infoWindows[i].close();
        }
    }

    function geocodeAddress($placeholder, geocoder, map, infowindow) {

        var addressesData = $placeholder.attr('data-addresses');
        var coordinates = $placeholder.attr('data-coordinates');
        var descriptionsData = $placeholder.attr('data-description');
        var openInfoWindow = $placeholder.attr('data-infowindow');
        var position = null;

        if (addressesData) {

            var addresses = addressesData.split('|');
            var descriptions = descriptionsData.split('|');

            if (addresses.length) {

                for (var i = 0; i < addresses.length; i++) {
                    var address = addresses[i];

                    geocoder.geocode({ 'address': address }, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            position = results[0].geometry.location;
                            addressInfo = results[0].formatted_address;

                            drawMap(map, infowindow, openInfoWindow, addressInfo, position);
                        }
                    });
                }
            }

        } else {
            var coordinatesToValues = coordinates.split('|');
            position = { lat: parseFloat(coordinatesToValues[0]), lng: parseFloat(coordinatesToValues[1]) };

            drawMap(map, infowindow, openInfoWindow, descriptionsData, position);
        }
    }

    function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination, el, messageHolder) {
        selectedMode = el.val();
        originVal = origin.val();
        directionsService.route({
            origin: originVal,
            destination: destination,
            travelMode: google.maps.TravelMode[selectedMode],
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);

                // Removing focus form 'From' input field
                origin.blur();

                // Map is draggable
                map.setOptions({ draggable: true });

                messageHolder.text('please find your directions above');
            } else {
                if (status == 'ZERO_RESULTS' || status == 'NOT_FOUND') {
                    messageHolder.text('please enter/check your starting point');
                }
            }
        });
    }

    // Compute distance
    function computeTotalDistance(result, $distanceHolder) {
        var total = 0;
        var myroute = result.routes[0];

        for (i = 0; i < myroute.legs.length; i++) {
            total += myroute.legs[i].distance.value;
        }

        total = total / 1000 / 1.60934400251785;
        total = total.toFixed(1);
        $distanceHolder.text(total + " Miles");
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

    // Get it rolling
    function init() {
        $(function () {
            var $mapWrapper = $('.c-store-location__body');
            trafficLayer = new google.maps.TrafficLayer();

            if ($mapWrapper.length > 0) {

                var $mapContainer = $mapWrapper.find('.c-store-location__map-canvas');

                $mapContainer.each(function () {

                    $this = $(this);

                    var $distanceHolder = $mapWrapper.find('.c-store-location__distance-number');
                    var $modeDropDown = $mapWrapper.find('.c-store-location__mode');
                    var $messageHolder = $mapWrapper.find('.c-store-location__message');
                    var $originInput = $mapWrapper.find('.c-store-location__from');
                    var $currentLocation = $mapWrapper.find('.c-store-location__current-location');
                    var $navigateIcon = $mapWrapper.find('.c-store-location__navigate');
                    var $directionsHolder = $mapWrapper.find('.c-store-location__directions');
                    var $messageHolder = $mapWrapper.find('.c-store-location__message');
                    var origin;
                    var lat = $this.data('lat');
                    var lon = $this.data('lon');
                    var destination = new google.maps.LatLng(lat, lon);

                    var directionsDisplay = new google.maps.DirectionsRenderer,
                        directionsService = new google.maps.DirectionsService;

                    map = new google.maps.Map($this[0], {
                        zoom: 16,
                        scrollwheel: false,
                        draggable: !("ontouchend" in document)
                    });

                    // Showing the dirwctions on a map
                    directionsDisplay.setMap(map);

                    // We can render step-by-step directions if we wish to
                    // directionsDisplay.setPanel($directionsHolder[0]);

                    var geocoder = new google.maps.Geocoder(),
                        infowindow = new google.maps.InfoWindow;

                    geocodeAddress($this, geocoder, map, infowindow);

                    // This facilitates delayed interactions
                    var timer;
                    var timeout = 2000;

                    // Run on mode change
                    $modeDropDown.on('change', function () {

                        $this = $(this);
                        origin = $this.parents('.c-store-location__panel').find('.c-store-location__from');

                        if (origin) {
                            calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination, $this, $messageHolder, map);

                            // Scrolling to the top of the map
                            // $('html, body').animate({
                            //     scrollTop: $mapContainer.offset().top
                            // }, timeout);

                            //
                            // We could also have the Traffic layer if we want to.
                            trafficLayer.setMap(map);

                        } else {
                            $messageHolder.text('please enter your starting point');
                        }
                    });

                    // Clearing the value of input field on focus
                    $originInput.focus(function () {
                        $(this).val('');
                    });

                    // Only showing route after user finished typing
                    $originInput.keyup(function () {

                        clearTimeout(timer);

                        if ($originInput.val) {
                            timer = setTimeout(function () {

                                // Clearing markers from the map before we render the route
                                clearMarkers();

                                origin = $originInput;
                                var elMode = $originInput.parents('.c-store-location__panel').find('.c-store-location__mode');
                                calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination, elMode, $messageHolder, map);

                                // Scrolling to the top of the map
                                // $('html, body').animate({
                                //     scrollTop: $mapContainer.offset().top
                                // }, timeout);

                            }, 3000);
                        }
                    });

                    // Render route to "Enter" key press
                    $originInput.keypress(function (e) {
                        if (e.which == 13) {
                            // Clearing markers from the map before we render the route
                            clearMarkers();

                            origin = $originInput;
                            var elMode = $originInput.parents('.c-store-location__panel').find('.c-store-location__mode');
                            calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination, elMode, $messageHolder, map);
                        }
                    });

                    // Get current location                    
                    function getLocation() {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(showPosition);
                        } else {
                            $messageHolder.text("Geolocation is not supported by this browser.");
                        }
                    }

                    function showPosition(position) {
                        $originInput.val(position.coords.latitude.toString().substring(0, 9) + ',' + position.coords.longitude.toString().substring(0, 9));
                        // We now have an Origin input field populated, so
                        // it is safe to allow for 'Navigate' button to show
                        $navigateIcon.show();
                        origin = $originInput;
                        var elMode = $originInput.parents('.c-store-location__panel').find('.c-store-location__mode');
                        calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination, elMode, $messageHolder, map);
                    }

                    $currentLocation.click(function () {
                        getLocation();
                    });

                    $navigateIcon.click(function () {
                        origin = $originInput.val();
                        var addressesData = $this.attr('data-addresses');
                        var googleMapsURL = encodeURI('https://maps.google.com/maps?z=16&hl=en-US' + '&saddr=' + origin + '&daddr=' + addressesData);
                        window.open(googleMapsURL, '_blank');
                    });

                    // Calculation distance
                    google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
                        computeTotalDistance(directionsDisplay.directions, $distanceHolder);
                    });

                });
            }
        });
    }

    if ($storeLocation.length) {
        window.initMaps = init;
        $.getScript('https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyAMcLy_K8BFoc77Y17N9fdPdCO9SYiYBlY&hl=en&callback=initMaps');
    }
    /* Store Location component END */

    /* 
    * Store finder START
    */
    var stores = [
        {
            "id": 1,
            "name": "Camden BHF Shop",
            "address": "65 High Street, Camden, London, NW1 7JL",
            "lat": 51.5362147,
            "lng": -0.1404567
        },
        {
            "id": 2,
            "name": "Swiss Cottage BHF Shop",
            "address": "6 Harben Parade, Finchley Road, Swiss Cottage, London, NW3 6JP",
            "lat": 51.5446935,
            "lng": -0.1764832
        },
        {
            "id": 3,
            "name": "Holloway Road BHF Shop",
            "address": "436 Holloway Road, Islington, London, N7 6QA",
            "lat": 51.5575534,
            "lng": -0.1184379
        },
        {
            "id": 4,
            "name": "Holloway Home Store",
            "address": "93 Kilburn High Road, Kilburn, London, NW6 6JE",
            "lat": 51.5600633,
            "lng": -0.1156942
        },
        {
            "id": 5,
            "name": "Name 5",
            "address": "Address 5",
            "lat": 51.52811399654741,
            "lng": -0.15882110805250704
        },
        {
            "id": 6,
            "name": "Name 6",
            "address": "Address 6",
            "lat": 51.52918194189098,
            "lng": -0.1797637960407883
        },
        {
            "id": 7,
            "name": "Name 7",
            "address": "Address 7",
            "lat": 51.545198116121234,
            "lng": -0.1790771505329758
        },
        {
            "id": 8,
            "name": "Name 8",
            "address": "Address 8",
            "lat": 51.54711967830202,
            "lng": -0.1660308858845383
        },
        {
            "id": 9,
            "name": "Name 9",
            "address": "Address 9",
            "lat": 51.55224344738081,
            "lng": -0.1468048116657883
        },
        {
            "id": 10,
            "name": "Name 10",
            "address": "Address 10",
            "lat": 51.548827665446716,
            "lng": -0.14371490688063204
        },
        {
            "id": 11,
            "name": "Name 11",
            "address": "Address 11",
            "lat": 51.54050062247846,
            "lng": -0.1914367696736008
        },
        {
            "id": 12,
            "name": "Name 12",
            "address": "Address 12",
            "lat": 51.52725962223619,
            "lng": -0.1948699972126633
        },
        {
            "id": 13,
            "name": "Name 13",
            "address": "Address 13",
            "lat": 51.523841964665266,
            "lng": -0.1825103780720383
        },
        {
            "id": 14,
            "name": "Name 14",
            "address": "Address 14",
            "lat": 51.51850136115326,
            "lng": -0.1687774679157883
        },
        {
            "id": 15,
            "name": "Name 15",
            "address": "Address 15",
            "lat": 51.51828772398566,
            "lng": -0.1564178487751633
        },
        {
            "id": 16,
            "name": "Name 16",
            "address": "Address 16",
            "lat": 51.5202104224187,
            "lng": -0.1454315206501633
        },
        {
            "id": 17,
            "name": "Name 17",
            "address": "Address 17",
            "lat": 51.528754766759604,
            "lng": -0.1509246847126633
        },
        {
            "id": 18,
            "name": "Name 18",
            "address": "Address 18",
            "lat": 51.52170579841632,
            "lng": -0.13272857875563204
        },
        {
            "id": 19,
            "name": "Name 19",
            "address": "Address 19",
            "lat": 51.52170579841632,
            "lng": -0.1378784200642258
        },
        {
            "id": 20,
            "name": "Name 20",
            "address": "Address 20",
            "lat": 51.52469640310711,
            "lng": -0.12105560512281954
        },
        {
            "id": 21,
            "name": "Name 21",
            "address": "Address 21",
            "lat": 51.52448279499973,
            "lng": -0.11144256801344454
        },
        {
            "id": 22,
            "name": "Name 22",
            "address": "Address 22",
            "lat": 51.53601619890613,
            "lng": -0.11041259975172579
        },
        {
            "id": 23,
            "name": "Name 23",
            "address": "Address 23",
            "lat": 51.548827665446716,
            "lng": -0.11865234584547579
        },
        {
            "id": 24,
            "name": "Name 24",
            "address": "Address 24",
            "lat": 51.55117604307699,
            "lng": -0.12792206020094454
        },
        {
            "id": 25,
            "name": "Name 25",
            "address": "Address 25",
            "lat": 51.54840067467171,
            "lng": -0.1543579122517258
        },
        {
            "id": 26,
            "name": "Name 26",
            "address": "Address 26",
            "lat": 51.54156827725108,
            "lng": -0.1818237325642258
        },
        {
            "id": 27,
            "name": "Name 27",
            "address": "Address 27",
            "lat": 51.54242238303467,
            "lng": -0.1708374044392258
        },
        {
            "id": 28,
            "name": "Name 28",
            "address": "Address 28",
            "lat": 51.5230569329333,
            "lng": -0.155181884765625
        },
        {
            "id": 29,
            "name": "Name 29",
            "address": "Address 29",
            "lat": 51.525550825516135,
            "lng": -0.2079162618611008
        },
        {

            "id": 30,
            "name": "Name 30",
            "address": "Address 30",
            "lat": 51.52063767771414,
            "lng": -0.20070648402906954
        },
        {
            "id": 31,
            "name": "Name 31",
            "address": "Address 31",
            "lat": 51.51700587993574,
            "lng": -0.1948699972126633
        },
        {
            "id": 32,
            "name": "Name 32",
            "address": "Address 32",
            "lat": 51.51322956905176,
            "lng": -0.15895843505859375
        },
        {
            "id": 33,
            "name": "Name 33",
            "address": "Address 33",
            "lat": 51.513373792546524,
            "lng": -0.1900634786579758
        },
        {
            "id": 34,
            "name": "Name 34",
            "address": "Address 34",
            "lat": 51.515083046218066,
            "lng": -0.20619964809156954
        },
        {
            "id": 35,
            "name": "Name 35",
            "address": "Address 35",
            "lat": 51.52790040447265,
            "lng": -0.22267914027906954
        },
        {
            "id": 36,
            "name": "Name 36",
            "address": "Address 36",
            "lat": 51.54092768739326,
            "lng": -0.21993255824781954
        },
        {
            "id": 37,
            "name": "Name 37",
            "address": "Address 37",
            "lat": 51.54263590697582,
            "lng": -0.2065429708454758
        },
        {
            "id": 38,
            "name": "Name 38",
            "address": "Address 38",
            "lat": 51.55309735279095,
            "lng": -0.1983032247517258
        },
        {
            "id": 39,
            "name": "Name 39",
            "address": "Address 1",
            "lat": 51.55800699783751,
            "lng": -0.1818237325642258
        },
        {
            "id": 40,
            "name": "Name 40",
            "address": "Address 1",
            "lat": 51.5608511452948,
            "lng": -0.163421630859375
        },
        {
            "id": 41,
            "name": "Name 41",
            "address": "Address 1",
            "lat": 51.562489254404774,
            "lng": -0.1406250020954758
        },
        {
            "id": 42,
            "name": "Name 42",
            "address": "Address 1",
            "lat": 51.56142209053057,
            "lng": -0.11590576381422579
        },
        {
            "id": 43,
            "name": "Name 43",
            "address": "Address 1",
            "lat": 51.55629935532052,
            "lng": -0.10491943568922579
        },
        {
            "id": 44,
            "name": "Name 44",
            "address": "Address 1",
            "lat": 51.55096255921074,
            "lng": -0.10320282191969454
        },
        {
            "id": 45,
            "name": "Name 45",
            "address": "Address 1",
            "lat": 51.545411627037694,
            "lng": -0.09736633510328829
        },
        {
            "id": 46,
            "name": "Name 46",
            "address": "Address 1",
            "lat": 51.53900586371605,
            "lng": -0.09873962611891329
        },
        {
            "id": 47,
            "name": "Name 47",
            "address": "Address 1",
            "lat": 51.530105692125886,
            "lng": -0.127716064453125
        },
        {
            "id": 48,
            "name": "Name 48",
            "address": "Address 1",
            "lat": 51.51942532808189,
            "lng": -0.1270294189453125
        },
        {
            "id": 49,
            "name": "Name 49",
            "address": "Address 1",
            "lat": 51.513373792546524,
            "lng": -0.09942627162672579
        },
        {
            "id": 50,
            "name": "Name 50",
            "address": "Address 1",
            "lat": 51.51358745276296,
            "lng": -0.10903930873610079
        },
        {
            "id": 51,
            "name": "Name 51",
            "address": "Address 1",
            "lat": 51.511878142971476,
            "lng": -0.12002563686110079
        },
        {
            "id": 52,
            "name": "Name 52",
            "address": "Address 1",
            "lat": 51.51102346402405,
            "lng": -0.14165497035719454
        },
        {
            "id": 53,
            "name": "Name 53",
            "address": "Address 1",
            "lat": 51.5072466571743,
            "lng": -0.16582489013671875
        },
        {
            "id": 54,
            "name": "Name 54",
            "address": "Address 1",
            "lat": 51.5072466571743,
            "lng": -0.16582489013671875
        },
        {
            "id": 55,
            "name": "Name 55",
            "address": "Address 1",
            "lat": 51.50760458788741,
            "lng": -0.1797637960407883
        },
        {
            "id": 56,
            "name": "Name 56",
            "address": "Address 1",
            "lat": 51.51016876904204,
            "lng": -0.1914367696736008
        },
        {
            "id": 57,
            "name": "Name 57",
            "address": "Address 1",
            "lat": 51.50931405802537,
            "lng": -0.2024230977986008
        },
        {
            "id": 58,
            "name": "Name 58",
            "address": "Address 1",
            "lat": 51.512091810202925,
            "lng": -0.2161560079548508
        },
        {
            "id": 59,
            "name": "Name 59",
            "address": "Address 1",
            "lat": 51.52362835254964,
            "lng": -0.2333221456501633
        },
        {
            "id": 60,
            "name": "Name 60",
            "address": "Address 1",
            "lat": 51.538578780766535,
            "lng": -0.2340087911579758
        },
        {
            "id": 61,
            "name": "Name 61",
            "address": "Address 1",
            "lat": 51.554378180851614,
            "lng": -0.2271423360798508
        }

    ];

    var $storeFinder = $('.c-store-finder');

    function initStoreFinder() {

        $(function () {
            $storeFinder.each(function () {

                var map, infoWindow, circle, marker;
                var $mapCanvas = $storeFinder.find('.c-store-finder__map-canvas');

                var addressInput = $storeFinder.find('.c-store-finder__map-address').val();
                var radiusInput = parseInt($storeFinder.find('.c-store-finder__map-radius').val(), 10) * 1000;

                var $locateStoresBtn = $storeFinder.find('.c-store-finder__map-geocode');
                var $storesFoundHolder = $storeFinder.find('.c-store-finder__stores-found');
                var $storeList = $('.c-store-finder__stores-list');
                var $singleStore = $storeList.find('li');

                var locations = [];
                var storeMarkers = [];
                var geocoder = new google.maps.Geocoder();


                map = new google.maps.Map($mapCanvas[0], {
                    center: { lat: 51.5334123, lng: -0.1395652 },
                    zoom: 12
                });

                infoWindow = new google.maps.InfoWindow;

                // Try HTML5 geolocation.
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        var marker = new google.maps.Marker({
                            position: pos,
                            icon: 'https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/location-alt-48.png',
                            map: map,
                            zIndex: 1000,
                            title: 'You are here',
                            animation: google.maps.Animation.DROP
                        });

                        map.setCenter(pos);
                    }, function () {
                        handleLocationError(true, infoWindow, map.getCenter());
                    });
                } else {
                    codeAddress(addressInput, radiusInput);
                }

                function codeAddress(addressInput, radiusInput) {
                    // clearing out the storages
                    $storeList.empty();
                    storeMarkers = [];

                    geocoder.geocode({ 'address': addressInput }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            side_bar_html = "";
                            map.setCenter(results[0].geometry.location);
                            var searchCenter = results[0].geometry.location;

                            // Clearing out the center Marker before eash search
                            if (marker) {
                                marker.setMap(null);
                            }

                            // New Center marker
                            marker = new google.maps.Marker({
                                map: map,
                                position: results[0].geometry.location,
                                icon: 'https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/location-alt-48.png',
                            });

                            // resetting Circle if already exists
                            if (circle) circle.setMap(null);

                            circle = new google.maps.Circle({
                                center: searchCenter,
                                radius: radiusInput,
                                fillOpacity: 0.2,
                                fillColor: "#FF0000",
                                map: map
                            });

                            var bounds = new google.maps.LatLngBounds();
                            var foundMarkers = 0;

                            for (var i = 0; i < stores.length; i++) {

                                var storePos = {
                                    lat: stores[i].lat,
                                    lng: stores[i].lng
                                };

                                // Creating Marker for each store
                                var storeMarker = new google.maps.Marker({
                                    map: map,
                                    position: storePos,
                                    title: stores[i].name,
                                    id: 'storeId' + stores[i].id
                                });
                                // Applying infowindows
                                storeMarker['infowindow'] = new google.maps.InfoWindow({
                                    content: '<h4>' + stores[i].name + '</h4>' + '<p>' + stores[i].address + '</p>' + '<p><a href="http://www.google.com" target="_blank">Visit store page</a></p>'
                                });

                                storeMarker['distanceFromCenter'] = DistanceBetweenCenterAndMarker;

                                // Adding one each marker to collection of markers
                                storeMarkers.push(storeMarker);

                                // Distance between Center and A store marker (straight line) 
                                var DistanceBetweenCenterAndMarker = google.maps.geometry.spherical.computeDistanceBetween(storeMarker.getPosition(), searchCenter);

                                // Opening relevant infowindow on Marker click
                                google.maps.event.addListener(storeMarker, 'click', function () {
                                    for (i = 0; i < storeMarkers.length; i++) {
                                        storeMarkers[i]['infowindow'].close(map, this);
                                    }
                                    this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1, this);
                                    this['infowindow'].open(map, this);

                                    // Applying active class to an appropriate Store list element
                                    $storeList.find('li').removeClass('active');
                                    $storeList.find('li#' + this.id).addClass('active');
                                });

                                // injecting stores into a list
                                store = '<li id="storeId' + stores[i].id + '">';
                                store += stores[i].name;
                                store += '</li>';

                                if (DistanceBetweenCenterAndMarker < radiusInput) {
                                    bounds.extend(storeMarkers[i].getPosition());
                                    // Adding store to a list
                                    $storeList.append(store);
                                    // Putting a merker onto a Map
                                    storeMarkers[i].setMap(map);
                                    foundMarkers++;

                                } else {
                                    storeMarkers[i].setMap(null);
                                }
                            }

                            // Animating Store marker on Store list item click
                            $(document).on('click', '.c-store-finder__stores-list li', function () {
                                var storeId = $(this).prop('id');

                                $storeList.find('li').removeClass('active');
                                $(this).addClass('active');

                                for (i = 0; i < storeMarkers.length; i++) {
                                    storeMarkers[i]['infowindow'].close();

                                    if (storeMarkers[i].id === storeId) {
                                        storeMarkers[i].setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
                                        storeMarkers[i].setAnimation(4);
                                        storeMarkers[i]['infowindow'].open(map, storeMarkers[i]);
                                    }
                                }
                            });

                            // Inject the quantity of stores found
                            $storesFoundHolder.text(foundMarkers);

                            // if (foundMarkers > 0) {
                            //     map.fitBounds(bounds);
                            // } else {
                            map.fitBounds(circle.getBounds());
                            // }
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                }

                function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                    infoWindow.setPosition(pos);
                    infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
                    infoWindow.open(map);
                }

                $locateStoresBtn.on('click', function () {
                    // Removing all Markers prior to re-populating
                    if (storeMarkers.length) {
                        for (var i = 0; i < storeMarkers.length; i++) {
                            storeMarkers[i].setMap(null);
                        }
                    }
                    addressInput = $storeFinder.find('.c-store-finder__map-address').val();
                    radiusInput = parseInt($storeFinder.find('.c-store-finder__map-radius').val(), 10) * 1609.34;
                    codeAddress(addressInput, radiusInput);
                });
            });
        });
    }

    if ($storeFinder.length) {
        window.initSF = initStoreFinder;
        $.getScript('https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyAMcLy_K8BFoc77Y17N9fdPdCO9SYiYBlY&hl=en&libraries=geometry&callback=initSF');
    }
    /* Store finder END */

    // Is event in view helper function START
    $.fn.inView = function () {
        //Window Object
        var $win = $(window);
        //Object to Check
        el = $(this);
        //the top Scroll Position in the page
        var scrollPosition = $win.scrollTop();
        //the end of the visible area in the page, starting from the scroll position
        var visibleArea = $win.scrollTop() + $win.height();
        //the end of the object to check
        var elEndPos = (el.offset().top + el.outerHeight());
        return (visibleArea >= elEndPos && scrollPosition <= elEndPos ? true : false)
    };
    // Is event in view helper function END

    /* 
    * Media Component START
    */
    var MediaComponent = (function () {
        function MediaComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initMediaComponent();
        }

        MediaComponent.prototype.initMediaComponent = function () {
            this.setClasses(this.componentSelector);
            this.setCounter(this.componentSelector);
            this.slideOnArows(this.componentSelector);
            this.slideOnSwipe(this.componentSelector);
            this.closeModal(this.componentSelector);
            this.openModalOnSlideClick(this.componentSelector);
            this.openModalOnExpandClick(this.componentSelector);
            this.adjustSliderHeightOnResize(this.componentSelector);
            this.adjustSliderHeight(this.componentSelector);
            this.reactToKeystrokes(this.componentSelector);
            this.injectModalNavigation(this.componentSelector);
            this.slideOnNav(this.componentSelector);
            this.doOnWindowResize(this.componentSelector);
        };

        MediaComponent.prototype.setClasses = function (componentSelector) {
            var $_self = $(componentSelector);
            var $sliderControls = $_self.find('.c-media-component__controls');
            var $modalArrows = $_self.find('.c-media-component__modal__arrow-nav');
            var $modalControls = $_self.find('.c-media-component__modal-footer-navigation');
            var $slidesQty = $_self.find('.c-media-component__slide').length;
            var $firstSlide = $_self.find('.c-media-component__slide').first();
            var $lastSlide = $_self.find('.c-media-component__slide').last();
            var $rightArrow = $_self.find('.c-media-component__right-arrow');
            var $counter = $_self.find('.c-media-component__counter');
            $firstSlide.addClass('first active');
            $lastSlide.addClass('last');

            // If we only have one slide
            if ($firstSlide.hasClass('active') && $firstSlide.hasClass('last')) {
                // Hiding 'Slide Right' arrow
                $rightArrow.hide();
            }

            // Showing navigation if there are more then one slide
            if ($slidesQty > 1) {
                $sliderControls
                    .add($modalControls)
                    .add($modalArrows)
                    .add($counter)
                    .addClass('is-visible');
            }
        };

        MediaComponent.prototype.setCounter = function (componentSelector) {
            var $_self = $(componentSelector);
            var $currentHolder = $_self.find('.c-media-component__counter-nth');
            var $totalHolder = $_self.find('.c-media-component__counter-total');
            var $slide = $_self.find('.c-media-component__slide');
            var slidesQty = $slide.length;

            $currentHolder.text('1');
            $totalHolder.text(slidesQty);
        };

        MediaComponent.prototype._updateCounter = function (componentSelector, dataPos) {
            var $_self = $(componentSelector);
            var $currentHolder = $_self.find('.c-media-component__counter-nth');

            $currentHolder.text(++dataPos);
        }

        MediaComponent.prototype.slideOnArows = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $leftArrow = $_self.find('.c-media-component__left-arrow');
            var $rightArrow = $_self.find('.c-media-component__right-arrow');
            var $slide = $_self.find('.c-media-component__slide');
            var slidesQty = $slide.length;
            $rightArrow.click(function () {
                that.slide($_self, 'left');
            });
            $leftArrow.click(function () {
                that.slide($_self, 'right');
            });
        };

        MediaComponent.prototype.slideOnNav = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $navSpan = $_self.find('.c-media-component__modal-footer-navigation span');
            var $slide = $_self.find('.c-media-component__slide');
            var slidesQty = $_self.find('.c-media-component__slide').length;
            var leftArrow = $_self.find('.c-media-component__left-arrow');
            var rightArrow = $_self.find('.c-media-component__right-arrow');

            $navSpan.click(function () {
                $_self.attr('data-pos', $(this).index());

                // Resetting active slide iframe 'src' tag value
                that._resetActiveSlideIframeSrc($_self, 0);

                // Clearing all slides and modal nav span from "active" class
                $slide.removeClass('active').attr('aria-hidden', 'true');
                $navSpan.removeClass('active').attr('aria-selected', 'false');

                // Applying an "active" class to a relevant slide
                $slide.eq($(this).index()).addClass('active').attr('aria-hidden', 'false');
                $(this).addClass('active').attr('aria-selected', 'true');

                // Updating contents of modal box
                that._updateModalContent($_self);

                // Keeping track of counter
                that._updateCounter($_self, $(this).index());

                // Hiding and showing navigation arrows appropriately
                var $activeSlide = $_self.find('.c-media-component__slide.active');
                $activeSlide.index() >= 1 ? leftArrow.find('button').attr('disabled', false) : leftArrow.find('button').attr('disabled', true)
                $activeSlide.index() === slidesQty - 1 ? rightArrow.find('button').attr('disabled', true) : rightArrow.find('button').attr('disabled', false);

            });
        };

        MediaComponent.prototype.slide = function (componentSelector, direction) {
            var that = this;
            var $_self = $(componentSelector);
            var $slide = $_self.find('.c-media-component__slide');
            var slidesQty = $slide.length;
            var currentPos = parseInt($_self.attr('data-pos'), 10);
            var leftArrow = $_self.find('.c-media-component__left-arrow');
            var rightArrow = $_self.find('.c-media-component__right-arrow');
            var $navSpan = $_self.find('.c-media-component__modal-footer-navigation span');

            // Making sure the CSS 'transition' kicks in without delay
            $(window).trigger('resize');

            // Resetting active slide iframe 'src' tag value
            that._resetActiveSlideIframeSrc($_self, 500);

            // Resetting modal navigation from "active" class and setting ARIA attribute
            $navSpan.removeClass('active').attr('aria-selected', 'false');

            // Sliding "left"
            if (direction === 'left') {
                var newPos = currentPos + 1;
                $_self.find($slide).each(function () {
                    $(this).not('.last').removeClass('active').attr('aria-hidden', 'true');
                    if (currentPos === $(this).index() - 1) {
                        $(this).addClass('active').attr('aria-hidden', 'false');
                    }
                });
                if (currentPos === (slidesQty - 1)) {
                    // console.log('Can not slide left as this is last last slide');
                    $navSpan.eq(slidesQty - 1).addClass('active').attr('aria-selected', 'true');
                    return false;
                }
                else {
                    $_self.attr('data-pos', newPos.toString());

                    // Adjusting class for active modal nav
                    $navSpan.eq(newPos).addClass('active').attr('aria-selected', 'true');
                }

                // Updating contents of modal box
                that._updateModalContent($_self);

                // Keeping track of counter
                that._updateCounter($_self, newPos);

                // Adjusting class for active modal nav
                $navSpan.eq(newPos).addClass('active').attr('aria-selected', 'true');

                //move the last item and put it as first item
                // $slide.last().after($slide.first());
            }
            // Sliding "right"
            else {
                var newPos = currentPos - 1;
                $_self.find($slide).each(function () {
                    $(this).not('.first').removeClass('active').attr('aria-hidden', 'true');
                    if (currentPos === $(this).index() + 1) {
                        $(this).addClass('active').attr('aria-hidden', 'false');
                    }
                });
                if (currentPos === 0) {
                    // console.log('Can not slide right as this is the first slide');
                    $navSpan.eq(0).addClass('active').attr('aria-selected', 'true');
                    return false;
                }
                else {
                    $_self.attr('data-pos', newPos.toString());

                    // Adjusting class for active modal nav
                    $navSpan.eq(newPos).addClass('active').attr('aria-selected', 'true');
                }

                // Updating contents of modal box
                that._updateModalContent($_self);

                // Keeping track of counter
                that._updateCounter($_self, newPos);


                //move the last item and put it as first item
                // $slide.first().before($slide.last());
            }

            // Hiding and showing navigation arrows appropriately
            var $activeSlide = $_self.find('.c-media-component__slide.active');
            $activeSlide.index() >= 1 ? leftArrow.find('button').attr('disabled', false) : leftArrow.find('button').attr('disabled', true)
            $activeSlide.index() === slidesQty - 1 ? rightArrow.find('button').attr('disabled', true) : rightArrow.find('button').attr('disabled', false);

            // Showing / Hiding expand button if active slide has video
            this.showHideFullScreenBtn(componentSelector);

            // Opening modal
            this.openModalOnSlideClick(componentSelector);
            // Adjusting height
            this.adjustSliderHeight(componentSelector);
            // Calling this fuction every time slide moves
            that.openModalOnExpandClick(componentSelector);
        };

        MediaComponent.prototype.showHideFullScreenBtn = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $expandBtn = $_self.find('button.bhfi-expand');
            var $activeSlide = $_self.find('.c-media-component__slide.active');

            $activeSlide.hasClass('c-media-component__slide--has-video') ? $expandBtn.hide() : $expandBtn.show();
        }

        MediaComponent.prototype.slideOnSwipe = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $gesuredSlide = $_self.find('.c-media-component__slide')
                .add('.c-media-component__modal-content')
                .add('.c-media-component__modal-iframe');
            $gesuredSlide.each(function () {
                var touchstartX = 0;
                var touchendX = 0;
                $(this).on('touchstart', function (event) {
                    touchstartX = event.originalEvent.touches[0].pageX;
                });
                $(this).on('touchend', function (event) {
                    touchendX = event.originalEvent.changedTouches[0].pageX;
                    that.handleSwipe(touchstartX, touchendX, $_self);
                    event.stopPropagation();
                });
            });
        };

        MediaComponent.prototype.handleSwipe = function (touchstartX, touchendX, $componentSelector) {
            var that = this;
            var $_self = $componentSelector;
            var threshold = 50; // px
            // Swiping left
            if (touchendX < touchstartX && Math.abs(touchendX - touchstartX) > threshold) {
                that.slide($_self, 'left');
            }
            // Swiping right
            if (touchendX > touchstartX && Math.abs(touchendX - touchstartX) > threshold) {
                that.slide($_self, 'right');
            }
        };

        MediaComponent.prototype._updateModalContent = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $modalBox = $_self.find('.c-media-component__modal');
            var $activeSlide = $_self.find('.c-media-component__slide.active');

            if ($modalBox.is(':visible')) {
                if ($activeSlide.hasClass('c-media-component__slide--has-video')) {
                    that.injectVodeo($_self, $activeSlide);
                } else {
                    that.injectImage($_self, $activeSlide.find('img'));
                }

                // Injecting slide copy
                that.injectModalCopy($_self, $activeSlide);
            }
        };

        MediaComponent.prototype.injectImage = function (componentSelector, clickTarget) {
            var $_self = $(componentSelector);
            var $modalBox = $_self.find('.c-media-component__modal');
            var $imageTag = $_self.find('.c-media-component__modal-image');
            // Hiding iframe
            $modalBox.find('.c-media-component__modal-iframe').attr('src', '').hide();
            // Applying a src tag value using either 'data' or 'src' tags whichever exists
            $imageTag.attr('src', $(clickTarget).attr('data-src') ? $(clickTarget).attr('data-src') : $(clickTarget).attr('src')).show();
            // Showing the modal box with image
            if ($modalBox.not(':visible')) {
                $modalBox.attr('aria-hidden', false).show();
            }
        };

        MediaComponent.prototype.injectVodeo = function (componentSelector, $activeSlide) {
            var $_self = $(componentSelector);
            var $modalBox = $_self.find('.c-media-component__modal');
            var $imageTag = $_self.find('.c-media-component__modal-image');
            var $activeSlideYouTubeVideoId = $activeSlide.data('youtube-video');
            var $activeSlideVimeoVideoId = $activeSlide.data('vimeo-video');
            // Hiding modal box image
            $imageTag.attr('src', '').hide();

            // Setting 'src' prop and iframe
            if ($activeSlideYouTubeVideoId) {
                $modalBox.find('.c-media-component__modal-iframe').attr('src', '//www.youtube.com/embed/' + $activeSlideYouTubeVideoId + '?rel=0&autoplay=1&showinfo=0&wmode=transparent&fs=1&enablejsapi=1').show();
            }
            if ($activeSlideVimeoVideoId) {
                $modalBox.find('.c-media-component__modal-iframe').attr('src', '//player.vimeo.com/video/' + $activeSlideVimeoVideoId + '?autoplay=1').show();
            }

            // Show modal box
            if ($modalBox.not(':visible')) {
                $modalBox.attr('aria-hidden', false).show();
            }
        };

        MediaComponent.prototype.injectModalCopy = function (componentSelector, $activeSlide) {
            var $_self = $(componentSelector);
            var $modalBox = $_self.find('.c-media-component__modal');
            var $activeSlideHeader = $activeSlide.data('header');
            var $activeSlideCopy = $activeSlide.data('content');

            // Setting header string
            if ($activeSlideHeader !== '') {
                $modalBox.find('.c-media-component__modal-footer h4').text($activeSlideHeader);
            }
            if ($activeSlideCopy !== '') {
                $modalBox.find('.c-media-component__modal-footer p').text($activeSlideCopy);
            }
        };

        MediaComponent.prototype.injectModalNavigation = function (componentSelector, $activeSlide) {
            var $_self = $(componentSelector);
            var $modalBox = $_self.find('.c-media-component__modal');
            var $navHolder = $_self.find('.c-media-component__modal-footer-navigation');
            var slidesQty = $_self.find('.c-media-component__slide').length;

            $navHolder.html(
                $.map(Array(slidesQty), function (o, i) {
                    var setFirstActive = i == 0 ? 'class="active" aria-selected="true"' : 'aria-selected="false"';
                    i++;
                    return $('<span ' + setFirstActive + 'role="tab" tabindex="0"/>', { id: 'tab' + i });
                })
            );
        };

        MediaComponent.prototype.adjustSliderHeight = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $activeSlideImg = $_self.find('.c-media-component__slide.active img');
            var $slidesContainer = $_self.find('.c-media-component__slides');
            $slidesContainer.css({ 'height': $activeSlideImg.outerHeight() });
        };

        MediaComponent.prototype.adjustSliderHeightOnResize = function (componentSelector) {
            var that = this;
            var throttledResize = _.throttle(function () { that.adjustSliderHeight(componentSelector); }, 100);
            $(window).on('resize', throttledResize);

            // Kicks the Mefia Component to resize on first load
            $(window).trigger('resize');
        };

        MediaComponent.prototype.openModalOnSlideClick = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $activeSlide = $_self.find('.c-media-component__slide.active');
            var scrollBarWidth = (window.innerWidth - $(document).width()) * (-1);

            $activeSlide.on('click', function (event) {
                if ($(window).width() >= 768) {
                    if ($(this).hasClass('c-media-component__slide--has-video')) {
                        that.injectVodeo($_self, $(this));
                    } else {
                        if (event.target.tagName.toLowerCase() === 'img') {
                            that.injectImage($_self, event.target);
                        } else {
                            that.injectImage($_self, $(event.target).find('img'));
                        }
                    }
                    $('body').css({
                        'overflow': 'hidden',
                        'margin-left': scrollBarWidth + 'px',
                    });
                }

            });

            // Injecting active slide copy
            that.injectModalCopy($_self, $activeSlide);

            // Kicking off the nav logic
            this.slideOnNav(this.componentSelector);
        };

        MediaComponent.prototype.openModalOnExpandClick = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $activeSlide = $_self.find('.c-media-component__slide.active');
            var $expandButtton = $_self.find('.c-media-component__expand button');

            // Trigger a click on active slide once expand button is clicked
            $expandButtton.on('click', function () {
                $activeSlide.trigger('click');
                that._resetActiveSlideIframeSrc($_self, 650);
            });
        }

        MediaComponent.prototype._resetActiveSlideIframeSrc = function (componentSelector, delay) {
            var $_self = $(componentSelector);
            var $activeSlide = $_self.find('.c-media-component__slide.active');
            var origSrcAttr = $activeSlide.find('iframe').attr('src');
            var $activeSlideIframe = $_self.find('.c-media-component__slide.active iframe');

            // Resetting active slide iframe 'src' tag value
            setTimeout(function () {
                $activeSlideIframe.attr('src', origSrcAttr);
            }, delay);
        }

        MediaComponent.prototype._adjustDependentStyles = function (componentSelector) {
            var $_self = $(componentSelector);
            var $modalBox = $_self.find('.c-media-component__modal');

            // Clearing out the attributes contents of modal box and closing it
            $modalBox.find('.c-media-component__modal-image').attr('src', '');
            $modalBox.find('.c-media-component__modal-iframe').attr('src', '');
            $modalBox.css('display', 'none').attr('aria-hidden', true);
            $('body').removeAttr('style');

        };

        MediaComponent.prototype.closeModal = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $closeBtn = $_self.find('.c-media-component__close-btn');
            var $modalBox = $_self.find('.c-media-component__modal');
            $closeBtn.add($modalBox).on('click', function () {
                that._adjustDependentStyles($_self);
            }).children().not($closeBtn).on('click', function () {
                return false;
            });
        };

        MediaComponent.prototype.reactToKeystrokes = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $modalBox = $_self.find('.c-media-component__modal');

            $(document).keyup(function (e) {
                if ($_self.inView()) {

                    switch (e.which) {
                        case 27:
                            that._adjustDependentStyles($_self);
                            break;
                        case 37:
                            that.slide($_self, 'right');
                            break;
                        case 39:
                            that.slide($_self, 'left');
                            break;
                        default:
                            break;
                    }
                }
            });

        };

        MediaComponent.prototype.doOnWindowResize = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $modalBox = $_self.find('.c-media-component__modal');
            var $closeBtn = $_self.find('.c-media-component__close-btn');

            $(window).on('load', function () {
                $(window).on('resize orientationchange', function () {
                    if ($(window).width() < 768 && $modalBox.is(':visible')) {
                        $closeBtn.trigger('click');
                    }
                });
            });
        };

        return MediaComponent;
    }());

    $(function () {
        var MediaComponentHolder = '.c-media-component';

        $(MediaComponentHolder).each(function () {
            var mediaComponent = new MediaComponent($(this)); // Create a new Media Component instance
        });
    });
    /* Media Component END */

    /* LazyLoad START */
    $(".lazy").each(function () {
        if (!$(this).hasClass('animated')) {
            $(this).lazy({
                effect: "fadeIn",
                effectTime: 500,
                threshold: 650,
                removeAttribute: false,
                onError: function (element) {
                    console.log('Error loading ' + element.data('src'));
                }
            });
        } else {
            $(this).lazy({
                onError: function (element) {
                    console.log('Error loading ' + element.data('src'));
                }
            });
        }
    });
    /* LazyLoad END */

    /* Scroll Magic triggers START */

    /* Scroll Magic triggers END */

    /* Share selected text START */
    // plugin initialization with default options
    shareSelectedText('.c-text-component', {
        tooltipClass: '', // cool, if you want to customize the tooltip
        sanitize: true, // will sanitize the user selection to respect the Twitter Max length (recommended)
        buttons: [ // services that you want to enable you can add:
            'facebook', // - twitter, tumblr, buffer, stumbleupon, digg, reddit, linkedin, facebook
            'twitter'
        ],
        anchorsClass: '', // class given to each tooltip's links
        twitterUsername: '', // for twitter widget, will add 'via @twitterUsername' at the end of the tweet.
        facebookAppID: '2029712067316670', // Can also be an HTML element inside the <head> tag of your page : <meta property="fb:APP_ID" content="YOUR_APP_ID"/>
        facebookDisplayMode: 'popup', //can be 'popup' || 'page'
        tooltipTimeout: 250 //Timeout before that the tooltip appear in ms
    });
    /* Share selected text END */

    /* Forms v1 START */

    /* Note: 
    
    All functions for FORMS should be written in Typescript unless they explicitly rely on dependencies unable to import in Typescript. 
    
    Forms v2 now moved to forms.js - refactor here and move.
    
    */

    var $formMaster = $('.g-forms-parsley');
    var $formActual = $formMaster.find('form');
    var $clearControl = $formMaster.find('.cta__clear-form');
    var $parsleyNotice = $formMaster.find('.g-forms__validation--notice');


    /* Parsley JS clear form. */
    $clearControl.on('click', function (e) {
        e.preventDefault();
        $formActual.trigger('reset');
        $formActual.parsley().reset();
        $parsleyNotice.addClass('hidden');

        $("html, body").animate({
            scrollTop:
                $formActual.offset().top - 100
        }, 400);
    });


    if ($formMaster.length) {

        /* Form Submit */
        $formActual.parsley().on('form:validated', function () {
            var ok = $('.parsley-error').length === 0;
            if (!ok) {
                $parsleyNotice.removeClass('hidden');
                $("html, body").animate({
                    scrollTop:
                        $formActual.find('.parsley-error').offset().top - 100
                }, 400);
            } else {
                $parsleyNotice.addClass('hidden');
            }
        })
            .on('form:submit', function () {
                return true;
            });

    }

    /* Forms END */

    /* Totaliser component START */

    /*
        This component is mainly used in the microsite pages. It requires API call which is
        defined in the html as a data-attribute. It uses the counterup and waypoints plugins to show the 
        numbers in animation and on scroll.
    */


    /* Totaliser component END */

}); // Document ready end
