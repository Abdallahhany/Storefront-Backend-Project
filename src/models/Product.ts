import Client from "../database/database";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

export class ProductModel {
  async index(): Promise<Product[]> {
    try {
      // establish connection
      const conn = await Client.connect();

      // write SQL Query
      const sqlQuery = "SELECT * FROM products";

      //run the query in the database
      const result = await conn.query(sqlQuery);

      // close the connection
      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get products according to error: ${error}`);
    }
  }

  async show(productId: number): Promise<Product> {
    try {
      const conn = await Client.connect();

      const sqlQuery = "SELECT * FROM products WHERE id=($1)";

      const result = await conn.query(sqlQuery, [productId]);

      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get Product according to error: ${error}`);
    }
  }

  async create(prod: Product): Promise<Product> {
    try {
      const sql =
        "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *";

      const conn = await Client.connect();

      const result = await conn.query(sql, [
        prod.name,
        prod.price,
        prod.category,
      ]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${prod.name}. Error: ${err}`);
    }
  }

  async getProductsByCat(category: string): Promise<Product[]> {
    try {
      const sql = "SELECT * FROM products WHERE category = ($1)";
      const conn = await Client.connect();
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (e) {
      throw new Error(`Cannot get products according to category: ${category}`);
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    try {
      const sql = "DELETE FROM products WHERE id=($1) RETURNING * ";

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not delete product:  ${id}. Error: ${err}`);
    }
  }

  async update(product_id: number, product: Product): Promise<Product> {
    try {
      const sql =
        "UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *;";

      const conn = await Client.connect();

      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category,
        product_id,
      ]);

      const updatedProduct = result.rows[0];

      conn.release();

      return updatedProduct;
    } catch (err) {
      throw new Error(
        `Could not update product ${product.name}. Error: ${err}`
      );
    }
  }
}
