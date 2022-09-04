# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
    /api/products
- Index
  -     /all [GET]
    Response on success: Status 200
    ```json 
    [{
       'id': number,
       'name': string,
       'price': number,
       'category': string
    }]
    ```
- Show
  -     /product/:id [GET]
  - Response on success: Status 200
    ```json 
    {
        'id': number
        'name': string,
        'price': number,
        'category': string
    }
    ```

- Create [token required]
    - Not add token yet
    -     /add [POST]
    - JSON Body Object:
        ```json 
        {
            'name': string,
            'price': number,
            'category': string
        }
        ```

    - Response on success: Status 201
      ```json 
      {
          'id': number
          'name': string,
          'price': number,
          'category': string
      }
      ```
- Update [token required]
  - Not add token yet
  -     /product/:id [PUT]
  - JSON Body Object:
    ```json 
    {
        'name': string,
        'price': number,
        'category': string
    }
    ```

  - Response on success: Status 201
    ```json 
    {
        'id': number
        'name': string,
        'price': number,
        'category': string
    }
    ```
- delete
    -     /product/:id [DELETE]
    - Response on success: Status 200
      ```json 
      {
          'id': number
          'name': string,
          'price': number,
          'category': string
      }
      ```

- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)
    -     /product_by_cat/:cat [GET]
    - Response on success: Status 200
      ```json 
      {
          'id': number
          'name': string,
          'price': number,
          'category': string
      }
      ```
#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

