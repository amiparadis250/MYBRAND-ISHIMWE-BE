import app from './app'
import dotenv from 'dotenv';
dotenv.config();
import dbConnect  from './Config/dbConnect';
const PORT = process.env.PORT || 9000;

dbConnect();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


