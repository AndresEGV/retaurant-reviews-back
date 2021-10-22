const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
});

const getRestaurants = async (req, res) => {
  try {
    // const { rows } = await pool.query("select * from restaurants");
    const { rows } = await pool.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );

    return res.status(200).json({
      status: "success",
      results: rows.length,
      data: {
        restaurants: rows,
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRestaurantById = async (req, res) => {
  const { id } = req.params;

  try {
    const consulta = {
      text: "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      values: [id],
    };
    const consultaReview = {
      text: "select * from reviews where restaurant_id = $1",
      values: [id],
    };

    const {
      rows: [restaurant],
    } = await pool.query(consulta);

    const { rows } = await pool.query(consultaReview);

    return res.status(200).json({
      status: "success",

      data: {
        restaurant,
        reviews: rows,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const addRestaurant = async (req, res) => {
  const { name, location, priceRange } = req.body;

  try {
    const consulta = {
      text: "insert into restaurants (name,location,price_range) values ($1, $2, $3) returning *",
      values: [name, location, priceRange],
    };
    const {
      rows: [restaurant],
    } = await pool.query(consulta);
    return res.status(200).json({
      status: "success",
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const addReview = async (req, res) => {
  const { id } = req.params;
  const { name, review, rating } = req.body;

  try {
    const consulta = {
      text: "insert into reviews (restaurant_id,name,review, rating) values ($1, $2, $3, $4) returning *",
      values: [id, name, review, rating],
    };

    const {
      rows: [reviews],
    } = await pool.query(consulta);
    res.status(201).json({
      statu: "success",
      data: {
        reviews,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, location, price_range } = req.body;
  try {
    const consulta = {
      text: "update restaurants set name = $1, location =$2, price_range = $3 where id = $4 returning *",
      values: [name, location, price_range, id],
    };
    const {
      rows: [restaurant],
    } = await pool.query(consulta);
    return res.status(200).json({
      status: "success",
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const consulta = {
      text: "delete from restaurants where id = $1",
      values: [id],
    };
    const { rowCount } = await pool.query(consulta);
    return res.status(204).json({
      status: "success",
      rowCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
(async () => {
  await pool.query(`create table restaurants(id bigserial not null primary key,
    name varchar(50) not null,
    location varchar(50) not null,
    price_range int not null check(price_range >=1 and price_range <=5)
    );`);
})();
module.exports = {
  getRestaurants,
  getRestaurantById,
  addRestaurant,
  addReview,
  updateRestaurant,
  deleteRestaurant,
};
