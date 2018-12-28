const baseUrl = process.env.BASE_API
const api = {
  state: {
    socketApi: baseUrl + '/websocket?token=kl',
    imagesUploadApi: baseUrl + '/api/pictures'
  }
}

export default api
