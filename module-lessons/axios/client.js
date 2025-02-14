const axios = require('axios')

// i can create an axios instance when i an sending mutiple request with same configurations
// create method takes a configuration object. these configurations will be overridden by the request method configurations. 
const instance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'X-Name': 'axios'
    }
})

function axiosRequestHeader() {
    instance('/getTokenHeader', // when baseurl is provided, i have provide the rest of the url here
    {
        headers: {
            Authorization: "bearer ccd3e1c7c9c2c3d857ae2bb17af09847039e51ac2352b250bd26d7143ab49cd7ec24fbf3844e95541127ce96523e5b8ef56e3ce78df2afd74e04e53b0750ceb2"
        
        } // headers configuration used to send request headers
    })
    .then( response => response.data )
    .then( data => console.log('axiosRequestHeader ', data))
    .catch( err => console.log( err))
}

function axiosOverriddenConfig() {

    instance.get('/overriddenHeader', {
        headers: {
            // default X-Name is axios, see above. but here i override the value 
            // and server will send this header value back
            'X-Name': 'rahulstech', 
        }
    })
    .then( res => res.data )
    .then( data => console.log('axiosOverriddenConfig: ', data))
    .catch(err => console.log(err))
}

axiosOverriddenConfig()

