class Api {
  fetchProductsApi() {
    /**
     * axios trả về 1 promise (object)
     *  - pending: chờ
     *  - resolve: thành công
     *  - reject: thất bại
     */
    const promise = axios({
      url: "https://698b45d36c6f9ebe57bc2ca0.mockapi.io/Products",
      method: "GET",
    });

    return promise;
  }

  deleteProductByIdApi(id) {
    const promise = axios({
      url: `https://698b45d36c6f9ebe57bc2ca0.mockapi.io/Products/${id}`,
      method: "DELETE",
    });

    return promise;
  }

  addProductApi(product) {
    const promise = axios({
      url: `https://698b45d36c6f9ebe57bc2ca0.mockapi.io/Products`,
      method: "POST",
      data: product,
    });
    return promise;
  }

  getProductByIdApi(id) {
    const promise = axios({
      url: `https://698b45d36c6f9ebe57bc2ca0.mockapi.io/Products/${id}`,
      method: "GET",
    });

    return promise;
  }

  updateProductByIdApi(product) {
    const promise = axios({
      url: `https://698b45d36c6f9ebe57bc2ca0.mockapi.io/Products/${product.id}`,
      method: "PUT",
      data: product,
    });

    return promise;
  }
}

export default Api;
