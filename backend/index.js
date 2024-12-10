import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRouter from './routes/indexRouter.js';
import connectDb from './config/db.js';
import session from 'express-session';
import passport from 'passport';
import './controllers/googleAuthController.js';
import MongoStore from "connect-mongo";





const app = express();
app.set("trust proxy", 1); // Trust first proxy (e.g., Render's proxy)


app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'None',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
      autoRemove: "native",
    },
  }));
  

  app.use(passport.initialize());
  app.use(passport.session());


app.use(cookieParser());
app.use(express.json());


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "PATCH"],
}
  app.use(cors(corsOptions));

app.use('/', indexRouter);
// in production port is only taken by env.in local can take directly like 4000.this format imp
const PORT = process.env.PORT || 4000;

app.listen(PORT, (error) => {
    if(!error){
        connectDb();
        console.log(`server started at http://localhost:${PORT}`);
    }
    else{
        console.log('server starting error', error);
    }
    
})