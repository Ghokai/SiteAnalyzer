import * as express from "express";
import * as bodyParser from "body-parser";
import { Analyzer } from "./analyzer";
import * as cors from "cors";
import { CacheManager } from "./cache";

const port: number = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const cacheManager = new CacheManager();
cacheManager.clearCache();

app.get("/ping", function(req, res) {
  res.send({ result: "pong" });
});

app.post("/analyze", async function(req, res) {
  try {
    const site = req.body.site;
    if (!site) {
      res.status(400).send("Site uri must provided!");
      return;
    }
    if (!site.startsWith("http://") && !site.startsWith("https://")) {
      res.status(400).send("Site name must be typed with proper http prefix!");
      return;
    }

    let analyzer = new Analyzer();
    const results = await analyzer.analyzeSite(site);
    res.send(results);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

app.listen(port, () =>
  console.log(`Web site analyzer server listening on port ${port}!`)
);
