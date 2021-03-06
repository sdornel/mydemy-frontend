import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';

// Import face profile
// const JSON_PROFILE = require('../descriptors/bnk48.json');

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      facingMode: null
    };
  }

  // componentWillMount = async () => {
  //   await loadModels();
  //   
  //   this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
  //   this.setInputDevice();
  // };

  // componentDidMount(){

  //   // let allUsers
  //   let userInfo
  //   fetch('http://localhost:3000/users')
  //   .then(resp => resp.json())
  //   .then(users => {
  //     // allUsers = users
  //     for(let i = 0; i < users.length; i++){
  //       if(users[i].email === this.props.email){
  //         userInfo = users[i]

  //         loadModels();
  //         //{Me: {…}, Cherprang: {…}}
  //         console.log(JSON_PROFILE)
  //         
  //         this.setState({ faceMatcher: createMatcher(  {userInfo}  ) });
  //         // this.setState({ faceMatcher: createMatcher(  JSON_PROFILE  ) });
  //         this.setInputDevice();
  //       }
  //     }
  //     // 
  //   })
  //   // if(userInfo){
  //   // }
  // };

  componentWillMount = async () => {

    // // let allUsers
    // let userInfo
    // fetch('http://localhost:3000/users')
    // .then(resp => resp.json())
    // .then(users => {
    //   // allUsers = users
    //   for(let i = 0; i < users.length; i++){
    //     if(users[i].email === this.props.email){
    //       userInfo = users[i]

    //       await loadModels();
    //       //{Me: {…}, Cherprang: {…}}
    //       console.log(JSON_PROFILE)
    //       
    //       this.setState({ faceMatcher: await createMatcher(  {userInfo}  ) });
    //       // this.setState({ faceMatcher: createMatcher(  JSON_PROFILE  ) });
    //       this.setInputDevice();
    //     }
    //   }
    // })
    let userInfo
    const response = await fetch('http://localhost:3000/users')
    const users = await response.json()
      for(let i = 0; i < users.length; i++){
        if(users[i].email === this.props.email){

          users[i].face = [users[i].face]
          userInfo = users[i]
          
          await loadModels();
          //{Me: {…}, Cherprang: {…}}
          // console.log(JSON_PROFILE)
          
          this.setState({ faceMatcher: await createMatcher(  {userInfo}  ) });
          // this.setState({ faceMatcher: await createMatcher(  JSON_PROFILE  ) });
          this.setInputDevice();
        }
      }
    
  };


  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 'user'
        });
      } else {
        await this.setState({
          facingMode: { exact: 'environment' }
        });
      }
      // if(this.props.clickedLogin() === true){
      this.startCapture();
      // }
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };
  // startCapture = () => {
  //   this.interval = setInterval(() => {
  //     console.log("hit")
  //     this.capture();
  //   });
  // };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // capture = async () => {
  //   if (!!this.webcam.current) {
  //     // 
  //     console.log(this.webcam.current)
  //     await getFullFaceDescription(
  //       this.webcam.current.getScreenshot(),
  //       inputSize
  //     ).then(fullDesc => {
  //       
  //       if (!!fullDesc) {
  //         console.log(fullDesc)
  //         this.setState({
  //           detections: fullDesc.map(fd => fd.detection),
  //           descriptors: fullDesc.map(fd => fd.descriptor)
  //         });
  //       }
  //     });

  capture = async () => {
    if (!!this.webcam.current) {
      // 
      try {
      console.log(this.webcam.current)
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(fullDesc => {
        if (!!fullDesc) {
          console.log(fullDesc)
          // 
          this.setState({
            detections: fullDesc.map(fd => fd.detection),
            descriptors: fullDesc.map(fd => fd.descriptor)
          });
        }
      });

      if (!!this.state.descriptors && !!this.state.faceMatcher) {
        
        let match = await this.state.descriptors.map(descriptor => {
          
          return this.state.faceMatcher.findBestMatch(descriptor)
        })
        
        this.setState({ match });
        this.props.fMatch(match)
        // 
      }
    }
      catch(e){
        console.log("caught")
        this.capture()
      }
    }
  };

  render() {
    const { detections, match, facingMode } = this.state;
    let videoConstraints = null;
    let camera = '';
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
      if (facingMode === 'user') {
        camera = 'Front';
      } else {
        camera = 'Back';
      }
    }

    let drawBox = null;
    if (!!detections) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: 'blue',
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`
              }}
            >
              {!!match && !!match[i] ? (
                <p
                  style={{
                    backgroundColor: 'blue',
                    border: 'solid',
                    borderColor: 'blue',
                    width: _W,
                    marginTop: 0,
                    color: '#fff',
                    transform: `translate(-3px,${_H}px)`
                  }}
                >
                  {match[i]._label}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }
    return (
      <div
        className="Camera"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* <p>Camera: {camera}</p> */}
        <h3>Analying image and checking it against our records... please look into the camera and wait until your face has been recognized by our system</h3>
        <div
          style={{
            width: WIDTH,
            height: HEIGHT
          }}
        >
          <div style={{ position: 'relative', width: WIDTH }}>
            {!!videoConstraints ? (
              <div style={{ position: 'absolute' }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {!!drawBox ? drawBox : null}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(VideoInput);

// import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
// import Webcam from 'react-webcam';
// import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';

// // Import face profile
// const JSON_PROFILE = require('../descriptors/bnk48.json');

// const WIDTH = 420;
// const HEIGHT = 420;
// const inputSize = 160;

// class VideoInput extends Component {
//   constructor(props) {
//     super(props);
//     this.webcam = React.createRef();
//     this.state = {
//       fullDesc: null,
//       detections: null,
//       descriptors: null,
//       faceMatcher: null,
//       match: null,
//       facingMode: null
//     };
//   }

//   componentWillMount = async () => {
//     await loadModels();
//     this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
//     this.setInputDevice();
//   };

//   setInputDevice = () => {
//     navigator.mediaDevices.enumerateDevices().then(async devices => {
//       let inputDevice = await devices.filter(
//         device => device.kind === 'videoinput'
//       );
//       if (inputDevice.length < 2) {
//         await this.setState({
//           facingMode: 'user'
//         });
//       } else {
//         await this.setState({
//           facingMode: { exact: 'environment' }
//         });
//       }
//       // if(this.props.clickedLogin() === true){
//       this.startCapture();
//       // }
//     });
//   };

//   startCapture = () => {
//     this.interval = setInterval(() => {
//       this.capture();
//     }, 1500);
//   };
//   // startCapture = () => {
//   //   this.interval = setInterval(() => {
//   //     console.log("hit")
//   //     this.capture();
//   //   });
//   // };

//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }

//   capture = async () => {
//     if (!!this.webcam.current) {
//       await getFullFaceDescription(
//         this.webcam.current.getScreenshot(),
//         inputSize
//       ).then(fullDesc => {
//         if (!!fullDesc) {
//           
//           this.setState({
//             detections: fullDesc.map(fd => fd.detection),
//             descriptors: fullDesc.map(fd => fd.descriptor)
//           });
//         }
//       });

//       if (!!this.state.descriptors && !!this.state.faceMatcher) {
//         let match = await this.state.descriptors.map(descriptor => {
//           
//           return this.state.faceMatcher.findBestMatch(descriptor)
//         });
//          
//         this.setState({ match });
//         this.props.fMatch(match)
//       }
//     }
//   };

//   render() {
//     const { detections, match, facingMode } = this.state;
//     let videoConstraints = null;
//     let camera = '';
//     if (!!facingMode) {
//       videoConstraints = {
//         width: WIDTH,
//         height: HEIGHT,
//         facingMode: facingMode
//       };
//       if (facingMode === 'user') {
//         camera = 'Front';
//       } else {
//         camera = 'Back';
//       }
//     }

//     let drawBox = null;
//     if (!!detections) {
//       drawBox = detections.map((detection, i) => {
//         let _H = detection.box.height;
//         let _W = detection.box.width;
//         let _X = detection.box._x;
//         let _Y = detection.box._y;
//         return (
//           <div key={i}>
//             <div
//               style={{
//                 position: 'absolute',
//                 border: 'solid',
//                 borderColor: 'blue',
//                 height: _H,
//                 width: _W,
//                 transform: `translate(${_X}px,${_Y}px)`
//               }}
//             >
//               {!!match && !!match[i] ? (
//                 <p
//                   style={{
//                     backgroundColor: 'blue',
//                     border: 'solid',
//                     borderColor: 'blue',
//                     width: _W,
//                     marginTop: 0,
//                     color: '#fff',
//                     transform: `translate(-3px,${_H}px)`
//                   }}
//                 >
//                   {match[i]._label}
//                 </p>
//               ) : null}
//             </div>
//           </div>
//         );
//       });
//     }
//     return (
//       <div
//         className="Camera"
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center'
//         }}
//       >
//         <p>Camera: {camera}</p>
//         <div
//           style={{
//             width: WIDTH,
//             height: HEIGHT
//           }}
//         >
//           <div style={{ position: 'relative', width: WIDTH }}>
//             {!!videoConstraints ? (
//               <div style={{ position: 'absolute' }}>
//                 <Webcam
//                   audio={false}
//                   width={WIDTH}
//                   height={HEIGHT}
//                   ref={this.webcam}
//                   screenshotFormat="image/jpeg"
//                   videoConstraints={videoConstraints}
//                 />
//               </div>
//             ) : null}
//             {!!drawBox ? drawBox : null}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default withRouter(VideoInput);