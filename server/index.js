import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from './routes/posts.js'
import folderRoutes from './routes/folders.js'
import userRoutes from './routes/users.js'
import domainRoutes from './routes/domains.js'
import discussionformRoutes from './routes/discussionforum.js'

const app = express();

app.use(bodyParser.json({limit:'30mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}));
app.use(cors());


app.use('/posts',postRoutes);
app.use('/folders',folderRoutes);
app.use('/users',userRoutes);
app.use('/domains',domainRoutes);
app.use('/discussionforum',discussionformRoutes);

const CONNECTION_URL =
  "mongodb+srv://Admin:admin@cluster0.hvlvs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

//if deploy in heroku as production we shall pull react application into the server
// if (process.env.NODE_ENV === 'production'){

// }

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

mongoose.set("useFindAndModify", false);
