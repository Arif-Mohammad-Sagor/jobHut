const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = 5000;
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://JobHut:OlIFbXQMIaX0mezn@cluster0.gmwr7s9.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const jobsCollection = client.db("Jobs_Market").collection("fresh-jobs");
    const ExJobsCollection = client
      .db("Jobs_Market")
      .collection("experienced-jobs");
    const ITCompanyCollection = client
      .db("Jobs_Market")
      .collection("IT-Companies");

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/freshJobs", async (req, res) => {
      try {
        const data = await jobsCollection.find({}).toArray();
        res.send({
          message: "success",
          data,
        });
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/ExperiencedJobs", async (req, res) => {
      try {
        const data = await ExJobsCollection.find({}).toArray();
        res.send({
          message: "success",
          data,
        });
      } catch (error) {
        console.log(error);
      }
    });
    // getting national it  companies
    app.get("/countryCode", async (req, res) => {
      const { country } = req.query;

      try {
        const data = await ITCompanyCollection.find({
          country: country,
        }).toArray();
        res.send({
          message: "success",
          data,
        });
      } catch (error) {
        console.log(error);
      }
    });
    // getting here international countries
    app.get("/intCountryCode", async (req, res) => {
      const { country } = req.query;

      try {
        const query = country ? { country: { $ne: country } } : {};

        const data = await ITCompanyCollection.find(query).toArray();
        res.send({
          message: "success",
          data,
        });
      } catch (error) {
        console.log(error);
      }
    });

    // API route to get a specific country by ID
    app.get("/company/:id", async (req, res) => {
      const { id } = req.params;
      try {
          const companyId = new ObjectId(id);
        const company = await ITCompanyCollection.findOne({ _id: companyId });
        res.send({
          message: "success",
          data:company,
        });
      } catch (error) {
        console.error("Error retrieving document:", error);
        res.status(500).json({ message: "Error retrieving specific data." });
      }
    });

    app.listen(port, () => {
      console.log(`my server is running well`);
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  } finally {
  }
}

run().catch(console.dir);
