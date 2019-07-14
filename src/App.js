import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

// Options for the particles.js plugin / background animation
const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

// Initial state object to reset the state when needed
const initialState = {
  input: '',
  imageUrl: '',
  error: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      error: '',
      box: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  // This method gets passed down to the Register and Signin components to set the state with the correct user data
  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  // This method calculates the exact location of each face and the return value gets used by the displayFaceBox() method
  calculateFaceLocation = data => {
    // Getting the dimensions of the image
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    const faces = [];

    // If the image doesn't contain any facial data, we return the empty array
    if (Object.entries(data.outputs[0].data).length === 0) {
      return faces;
    } else {
      // otherwise we fill the empty array with the position data of all the instances where the API found faces
      for (let i = 0; i < data.outputs[0].data.regions.length; i++) {
        const clarifaiFace =
          data.outputs[0].data.regions[i].region_info.bounding_box;

        faces.push({
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height
        });
      }
      return faces;
    }
  };

  // Setting the box state with the return value from the calculateFaceLocation() method
  displayFaceBox = newBox => {
    this.setState({ box: newBox });
  };

  // Setting the input state when user types URL into box
  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  // This method checks if the submitted URL ends with typical image type endings
  checkURL = url => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  // Submitting the image URL
  onButtonSubmit = e => {
    e.preventDefault();

    // Setting the imageURL to the input of the user, the box to an empty array in case there was a previous submission to remove the boxes and the error to an empty string in case there was a previous error
    this.setState({ imageUrl: this.state.input, box: [], error: '' });
    const isImage = this.checkURL(this.state.input);

    // Only if the URL has a valid ending of jpg, png, etc., send URL to API
    if (isImage) {
      fetch('https://young-oasis-92479.herokuapp.com/imageurl', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: this.state.input
        })
      })
        // If we have a response, update the entry count of the user
        .then(response => response.json())
        .then(response => {
          if (response) {
            fetch('https://young-oasis-92479.herokuapp.com/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(
                  Object.assign(this.state.user, { entries: count })
                );
              })
              .catch(console.log);
          }
          // Send the data to the calculateFaceLocation() method that returns the position values of each box that get displayed by the displayFaceBox() method
          this.displayFaceBox(this.calculateFaceLocation(response));
        })
        // If the image can't be loaded due to a faulty URL, change error state which gets passed down to FaceRecognition component and rendered for user
        .catch(err =>
          this.setState({ error: 'The image could not be retrieved' })
        );
    } else {
      // If the image URL doesn't end on a valid image ending, set error state which gets rendered for user
      this.setState({ error: 'Please provide a valid image URL' });
    }
  };

  // Changing route depending on current state
  onRouteChange = route => {
    // If users clicks "Sign out", reset state completely
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {/* If user is signed in, show the home page */}
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
              error={this.state.error}
            />
          </div>
          // Otherwise, depending on the state, show the Register or Signin page
        ) : route === 'signin' || route === 'signout' ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
