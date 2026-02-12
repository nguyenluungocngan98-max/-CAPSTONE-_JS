class Api {
  fetchProductsApi() {
    const promise = axios({
      url: "https://698b45d36c6f9ebe57bc2ca0.mockapi.io/Products",
      method: "GET",
    });

    return promise;
  }
}

export default Api;