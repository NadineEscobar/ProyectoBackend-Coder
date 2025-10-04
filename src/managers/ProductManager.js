const Product = require("../models/Product.model");

class ProductManager {
  
  async getProducts(options = {}) {
    try {
      const limit = Number(options.limit) || 10;
      const page = Number(options.page) || 1;
      const sortParam = options.sort;
      const query = options.query; 

      
      const filter = {};
      if (query) {
        const [key, ...rest] = query.split(":");
        const value = rest.join(":");
        if (key === "category") filter.category = value;
        else if (key === "status") filter.status = (value === "true");
        else if (key === "title") filter.title = { $regex: value, $options: "i" }; 
      }

      
      const sort = {};
      if (sortParam === "asc") sort.price = 1;
      else if (sortParam === "desc") sort.price = -1;

      
      const optionsPaginate = { page, limit, lean: true };
      if (Object.keys(sort).length) optionsPaginate.sort = sort;

      const result = await Product.paginate(filter, optionsPaginate);
      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/?${new URLSearchParams({ ...options, page: result.prevPage }).toString()}` : null,
        nextLink: result.hasNextPage ? `/?${new URLSearchParams({ ...options, page: result.nextPage }).toString()}` : null
      };
    } catch (error) {
      console.error("❌ Error en getProducts:", error);
      return { status: "error", error: error.message };
    }
  }

  
  async getProductById(id) {
    try {
      return await Product.findById(id).lean();
    } catch (error) {
      console.error("❌ Error en getProductById:", error);
      return null;
    }
  }

 
  async addProduct(productData) {
    try {
      const created = await Product.create(productData);
      return created.toObject();
    } catch (error) {
      console.error("❌ Error en addProduct:", error);
      return null;
    }
  }

  
  async updateProduct(id, updates) {
    try {
      const updated = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
      return updated;
    } catch (error) {
      console.error("❌ Error en updateProduct:", error);
      return null;
    }
  }

 
  async deleteProduct(id) {
    try {
      const removed = await Product.findByIdAndDelete(id);
      return !!removed;
    } catch (error) {
      console.error("❌ Error en deleteProduct:", error);
      return false;
    }
  }
}

module.exports = ProductManager;
