import React, { useState, useRef } from "react";
import Map from "./Components/Map.jsx";
import "semantic-ui-css/semantic.min.css";
import { Menu, Segment, Sidebar, Dropdown } from "semantic-ui-react";

function App() {
  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [activeItem, setActiveItem] = useState("Actions");

  const [restaurants, setRestaurants] = useState({ results: [] });
  const [hospitals, setHospitals] = useState({ results: [] });
  const [shoppingcenters, setShoppingCenters] = useState({ results: [] });

  const handleItemClick = () => {
    setVisible(!visible);
    console.log(visible);
  };

  return (
    <>
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item
            name="Actions"
            active={activeItem === "Actions"}
            onClick={() => {
              setActiveItem("Actions");
              handleItemClick();
            }}
          />
          <Dropdown
            as="Menu.Item"
            placeholder="Select Restaurant"
            fluid
            selection
          >
            <Dropdown.Menu>
              {restaurants.results.map(restaurant => {
                return (
                  <Dropdown.Item
                    text={restaurant.poi.name}
                    value={restaurant.poi.name}
                    onClick={() => {
                      childRef.current.findRouteWrapper(
                        restaurant,
                        "restaurant"
                      );
                    }}
                  ></Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            as="Menu.Item"
            placeholder="Select Hospital"
            fluid
            selection
          >
            <Dropdown.Menu>
              {hospitals.results.map(hospital => {
                return (
                  <Dropdown.Item
                    text={hospital.poi.name}
                    value={hospital.poi.name}
                    onClick={() => {
                      childRef.current.findRouteWrapper(hospital, "hospital");
                    }}
                  ></Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            as="Menu.Item"
            placeholder="Select Shopping Center"
            fluid
            selection
          >
            <Dropdown.Menu>
              {shoppingcenters.results.map(shoppingcenter => {
                return (
                  <Dropdown.Item
                    text={shoppingcenter.poi.name}
                    value={shoppingcenter.poi.name}
                    onClick={() => {
                      childRef.current.findRouteWrapper(
                        shoppingcenter,
                        "shoppingcenter"
                      );
                    }}
                  ></Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
      </Segment>
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation="overlay"
          direction="left"
          icon="labeled"
          inverted
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width="thin"
        >
          <Menu.Item
            as="a"
            onClick={() => {
              childRef.current.handleApiCallWrapper();
              handleItemClick();
            }}
          >
            Get Future Possible Location
          </Menu.Item>
          <Menu.Item
            as="a"
            onClick={async () => {
              const currRestaurants = await childRef.current.findNearbyLocationWrapper(
                "restaurant"
              );
              setRestaurants(currRestaurants);
            }}
          >
            Find Nearby Restaurants
          </Menu.Item>
          <Menu.Item
            as="a"
            onClick={async () => {
              const currHospitals = await childRef.current.findNearbyLocationWrapper(
                "hospital"
              );
              setHospitals(currHospitals);
            }}
          >
            Find Nearby Hospitals
          </Menu.Item>
          <Menu.Item
            as="a"
            onClick={async () => {
              const currShoppingCenters = await childRef.current.findNearbyLocationWrapper(
                "shoppingcenter"
              );
              setShoppingCenters(currShoppingCenters);
            }}
          >
            Find Nearby ShoppingCenters
          </Menu.Item>
        </Sidebar>

        <Sidebar
          as={Menu}
          animation="overlay"
          direction="right"
          inverted
          vertical
          visible={false}
        >
          <Menu.Item header>Nearby Restaurants</Menu.Item>
          {restaurants.results.map((restaurant, i) => {
            return (
              <Menu.Item
                as="a"
                onClick={() => {
                  childRef.current.findRouteWrapper(restaurant, "restaurant");
                }}
              >
                {restaurant.poi.name}
              </Menu.Item>
            );
          })}
          <Menu.Item header>Nearby Hospitals</Menu.Item>
          {hospitals.results.map((hospital, i) => {
            return (
              <Menu.Item
                as="a"
                onClick={() => {
                  childRef.current.findRouteWrapper(hospital, "hospital");
                }}
              >
                {hospital.poi.name}
              </Menu.Item>
            );
          })}
          <Menu.Item header>Nearby ShoppingCenters</Menu.Item>
          {shoppingcenters.results.map((shoppingcenter, i) => {
            return (
              <Menu.Item
                as="a"
                onClick={() => {
                  childRef.current.findRouteWrapper(
                    shoppingcenter,
                    "shoppingcenter"
                  );
                }}
              >
                {shoppingcenter.poi.name}
              </Menu.Item>
            );
          })}
        </Sidebar>

        <Sidebar.Pusher>
          <div id="map" style={({ width: 10 }, { height: 800 })}></div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <div>
        <Map ref={childRef} />
      </div>
    </>
  );
}

export default App;
