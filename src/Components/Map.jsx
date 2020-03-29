import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";

function toFixed(num, fixed) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}

const Map = forwardRef((props, ref) => {
  const [flag, setFlag] = useState(false);
  const [fg, setFg] = useState({});
  const [isDataUpdated, updateData] = useState(0);
  const [future, setFuture] = useState({
    Latitude: toFixed(40.4212216, 5),
    Longitude: toFixed(-3.6286935, 5)
  });
  const TomtomKEY = "2xrfCdFd2nGVXM5iYXAZpueDTqBfFYIh";
  const iconOptions = {
    hospital: {
      primaryColor: "#ff0000",
      secondaryColor: "#ff0000",
      shadow: true,
      size: "md",
      symbol: "H"
    },
    restaurant: {
      primaryColor: "#0e2433",
      secondaryColor: "#0e2433",
      shadow: true,
      size: "md",
      symbol: "R"
    },
    shoppingcenter: {
      primaryColor: "#ffa500",
      secondaryColor: "#ffa500",
      shadow: true,
      size: "md",
      symbol: "S"
    }
  };

  const fetchUrl = {
    restaurant: `https://api.tomtom.com/search/2/poiSearch/restaurant.json?limit=5&lat=${future.Latitude}&lon=${future.Longitude}&radius=1000&categorySet=7315&key=${TomtomKEY}`,
    hospital: `https://api.tomtom.com/search/2/poiSearch/.json?limit=5&lat=${future.Latitude}&lon=${future.Longitude}&radius=10000&categorySet=7321&key=${TomtomKEY}`,
    shoppingcenter: `https://api.tomtom.com/search/2/poiSearch/.json?limit=5&lat=${future.Latitude}&lon=${future.Longitude}&radius=10000&categorySet=7373&key=${TomtomKEY}`
  };

  useImperativeHandle(ref, () => ({
    handleApiCallWrapper() {
      handleApiCall();
    },
    findNearbyLocationWrapper(typeOfLocation) {
      return findNearbyLocation(typeOfLocation);
    },
    findRouteWrapper(location, typeOfLocation) {
      findRoute(location, typeOfLocation);
    }
  }));

  useEffect(() => {
    window.L.mapquest.key = "6kGGFBuABs2Z9TqeYxq7GTxpgA3N9Qeg";
    const newFg = window.L.featureGroup();
    setFg(newFg);

    window.L.mapquest.map("map", {
      center: [toFixed(40.4212216, 5), toFixed(-3.6286935, 5)],
      layers: [window.L.mapquest.tileLayer("dark"), newFg],
      zoom: 15
    });

    window.L.marker([toFixed(40.4212216, 5), toFixed(-3.6286935, 5)], {
      icon: window.L.mapquest.icons.marker({
        primaryColor: "#101820",
        secondaryColor: "#417505",
        shadow: true,
        size: "md"
      })
    }).addTo(newFg);
  }, []);

  const handleApiCall = () => {
    fetch("http://localhost:5000/getLocation")
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        setFuture(data);
        console.log(data.Latitude, typeof data.Latitude);
        var directions = window.L.mapquest.directions();
        directions.route(
          {
            start: [toFixed(40.4212216, 5), toFixed(-3.6286935, 5)],
            end: [data.Latitude, data.Longitude]
          },
          addCustomLayer
        );
        function addCustomLayer(err, response) {
          var customLayer = window.L.mapquest.directionsLayer({
            startMarker: {
              icon: "marker",
              iconOptions: {
                size: "md",
                primaryColor: "#101820",
                secondaryColor: "#417505"
              },
              draggable: false,
              title: "You are here"
            },
            endMarker: {
              icon: "marker",
              iconOptions: {
                size: "md",
                primaryColor: "#101820",
                secondaryColor: "#800000"
              },
              title: "Possible destination"
            },
            routeRibbon: {
              color: "#2aa6ce",
              opacity: 1.0,
              showTraffic: false
            },
            directionsResponse: response
          });
          customLayer.addTo(fg);
        }
        updateData(isDataUpdated + 1);
      });
  };

  const findNearbyLocation = async typeOfLocation => {
    var restaurants = [];
    await fetch(fetchUrl[typeOfLocation])
      .then(response => {
        return response.json();
      })
      .then(data => {
        restaurants = data;
      });
    return restaurants;
  };

  const findRoute = (location, typeOfLocation) => {
    console.log("inside find route", location);
    var directions = window.L.mapquest.directions();
    directions.route(
      {
        start: [toFixed(40.4212216, 5), toFixed(-3.6286935, 5)],
        end: [
          toFixed(location.position.lat, 5),
          toFixed(location.position.lon, 5)
        ]
      },
      addCustomLayer
    );
    function addCustomLayer(err, response) {
      var customLayer = window.L.mapquest.directionsLayer({
        startMarker: {
          icon: "marker",
          iconOptions: {
            size: "md",
            primaryColor: "#101820",
            secondaryColor: "#417505"
          },
          draggable: false,
          title: "You are here"
        },
        endMarker: {
          icon: "marker",
          iconOptions: iconOptions[typeOfLocation],
          title: location.poi.name
        },
        routeRibbon: {
          color: "#2aa6ce",
          opacity: 1.0,
          showTraffic: false
        },
        directionsResponse: response
      });
      customLayer.addTo(fg);
    }
  };
  return <></>;
});

export default Map;
