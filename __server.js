import express from 'express';
const app = express();
import { SitemapStream, streamToPromise } from 'sitemap';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

app.use(bodyParser.json({limit: "16kb"}));
app.use(bodyParser.urlencoded({extended: true, limit: "16kb"}));
app.use(cors({
  origin: "*"
}));

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("public"));
let date = new Date().toISOString();
let sitemap;

// app.get('/sitemap', async function (req, res) {
//   res.header('Content-Type', 'application/xml');
//   res.header('Content-Encoding', 'gzip');

//   // If we have a cached entry send it
//   if (sitemap) return res.send(sitemap)

//   try {

//       // Fetching todo records and mapping
//       // it the desired URL pattern
//       const data = "Hello",
//           todos = ["item","Product"],

//           // Base url of our site
//           smStream = new SitemapStream({ 
//               hostname: 'https://demosite.com/' }),
//           pipeline = smStream.pipe(zlib.createGzip());

//       // Write todo URL to the stream
//       todos.forEach(
//           item => smStream.write({
//               url: item, lastmod: date,
//               changefreq: 'daily', priority: 0.7
//           }));

//       // Manually add all the other important URLs
//       smStream.write({
//           url: '/about', lastmod: date,
//           changefreq: 'monthly', priority: 0.9
//       })
//       smStream.write({
//           url: '/contact', lastmod: date,
//           changefreq: 'monthly', priority: 0.9
//       })

//       // Cache the response
//       streamToPromise(pipeline).then(sm => sitemap = sm);
//       smStream.end()

//       // Stream write the response
//       pipeline.pipe(res).on('error', e => { throw e });
//   } catch (err) {
//       console.error(err)
//       res.status(500).end()
//   }
// });

app.get('/api', (req,res) => {
  return res.status(200).json({
    status:200,
    message: "Api is working fine",
    data: JSON.stringify(req.headers),
  })
})

app.use((req, res)=>{
 res.sendFile(path.join(__dirname, "dist", "index.html"));
})

app.use((_, res) =>{
 res.send({
  message: 'Not found!'
 })
});
  
 app.listen(5173, (req, res)=>{
  console.log("Server is listening on port 5173");
})

