const axios = require('axios');

function logResponse(response) {
    const { 
        config, // complete configuration to send the request

        data, // the response body

        headers // the response header

     } = response

    console.log('config: ', config)
    console.log('headers: ', headers)
    console.log('data: ', data)
}

async function axiosGet() {
    const response = await axios({
        // GET is the default request method,
        // i can omit explicit mention of method if the request method is GET
        method: 'get', 
        url: 'https://jsonplaceholder.typicode.com/todos',
        params: {
            userId: 5

        } // add search queries using params
    })

    logResponse(response)
}

async function axiosPost() {
    const respose = await axios.post(
        'https://jsonplaceholder.typicode.com/todos', // url
        
        {
            title: 'learn axios',
            completed: false,

        }, // request body

        {} // axios request configuration, optional
    )

    logResponse(respose)
}

axiosGet()
