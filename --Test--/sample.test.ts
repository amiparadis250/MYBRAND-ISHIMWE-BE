import { test, it, describe, expect, beforeAll, afterAll } from '@jest/globals';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import dotenv from 'dotenv';
import { ConnectOptions } from 'mongoose';
dotenv.config();

const ENV_db_URL = process.env.MONGODB_URI || '';

beforeAll(async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(ENV_db_URL, {
            
        } as mongoose.ConnectOptions);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}, 50000)
afterAll(async () => {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
});

describe('Aunthetications', () => {
    var Authtoken : string;
    it('POST api/users/register: Register Start', async () => {
        // Check if the user already exists before attempting to register
        const userExistsResponse = await supertest(app)
            .post('/api/users/login') // Use the login endpoint to check if the user exists
            .send({
                "password": "12345790003Us*@",
                "email": "pishimweaime9000@gmail.com"
            });

        if (userExistsResponse.status === 200) {
            // User exists, skip the registration test
            return;
        }
        const registrationResponse = await supertest(app)
            .post('/api/users/register')
            .send({
                "fullName": "uuu",
                "password": "12345790003Us*@",
                "email": "pishimweaime9000@gmail.com"
            });

        expect(registrationResponse.status).toBe(201);
        expect(registrationResponse.body.status).toBe('success');
    });

    it('POST api/users/login: User Logging in', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                "password": "0791966291Is*",
                "email": "amiparadis250@gmail.com"
            });
    
        // Check if the response status is 200
        expect(response.status).toBe(200);
    
        // Check if the response body has a 'status' property set to 'success'
        expect(response.body.status).toBe('success');
    
        expect(response.body.data.token).toBeTruthy();
    
         Authtoken = response.body.data.token;
        console.log(Authtoken );
    });
    it('GET api/users: Getting all Users', async () => {
        const response = await supertest(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${  Authtoken }`)
        expect(response.status).toBe(200);
       
    });
    it('GET api/users/:id: Getting a single User', async () => {
        const response = await supertest(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${  Authtoken }`)
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
    });
    it('GET api/users/:id: Deleting a single User', async () => {
        const response = await supertest(app)
        .delete('/api/users/profile/65db41b03d85a786e25eff26')
        .set('Authorization', `Bearer ${  Authtoken }`)
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
    });

    
    describe(' queries test',  () => {
        let querryid: string;
        it('POST /api/queries: Create a Query', async () => {
            const response = await supertest(app)
             .post('/api/queries')
             .send({
                
                    "email":"mugisha@gmail.com",
                    "guestQuery":"helloeeoeoe",
                    "guestName":"ISHIMWE Ami Paradis"
                
                });
                expect(response.status).toBe(200);

    })
    it('GET /api/queries: getting all Query', async () => {
    const response = await supertest(app)
            .get('/api/queries')
            .set('Authorization', `Bearer ${  Authtoken }`);

        expect(response.status).toBe(200);
    
        expect(response.body.status).toBe('success');
        querryid = response.body.data[0]._id;
    });
    it('GET /api/queries: getting all Query without Authorization', async () => {
        const response = await supertest(app)
                .get('/api/queries');
               expect(response.status).toBe(401);
              expect(response.body.status).toBe('error');
           
        });
    it('GET /api/queries:id getting single Query', async () => {
        const response = await supertest(app)
                .get(`/api/queries/${querryid}`)
                .set('Authorization', `Bearer ${  Authtoken }`);
    
            expect(response.status).toBe(200);
        
            expect(response.body.status).toBe('success');
          
        });
        it('GET /api/queries:id deleting single Query', async () => {
            const response = await supertest(app)
                    .delete(`/api/queries/${querryid}`)
                    .set('Authorization', `Bearer ${  Authtoken }`);
        
                expect(response.status).toBe(200);
            
                expect(response.body.status).toBe('success');
              
            });
            // it('GET /api/queries:id deleting single Query', async () => {
            //     const response = await supertest(app)
            //             .delete(`/api/queries/${querryid}`)
            //             .set('Authorization', `Bearer ${  Authtoken }`);
            
            //         expect(response.status).toBe(200);
            //         expect(response.body.data).toBe('message successfully deleted');
            //         expect(response.body.status).toBe('success');
                  
            //     });
                
});

    
let blogID ='';
describe('blogs controllers',()=>{
    it("GET api/blogs: getting all blog list ", async()=>{
     const response=await supertest(app).get('/api/blogs');
  blogID=response.body.data[0]._id;
   console.log(blogID);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success')
    expect(response.body.data.length).toBeGreaterThan(0);
       
    });
    it("GET api/blogs/:id :Getting Single Blog", async()=>{
        const response=await supertest(app).get('/api/blogs/'+blogID);
      
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success')
       
    });
    it("GET api/blogs/:id :Getting with invalid id Single Blog", async()=>{
        let blogid:string = ' 65da4f307a588f50b3545a61';
        const response=await supertest(app).get('/api/blogs/'+blogid);
      
        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe('error')
       
    });
 
    it("DELETE blogs/:id Deleting blog", async()=>{

    const response=await supertest(app).delete('/api/blogs/'+blogID).
    set('Authorization', `Bearer ${  Authtoken }`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success')
    })
    it("DELETE blogs/:id Deleting blog without Authorization", async()=>{

        const response=await supertest(app).delete('/api/blogs/'+blogID);
        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('error')
        expect(response.body.message).toBe('Unauthorized. Token not provided.')
        });
        it("DELETE blogs/:id Deleting blog with ivalid blogID", async()=>{

            const response=await supertest(app).delete(`/api/blogs/'+${4455}`)
            .set('Authorization', `Bearer ${  Authtoken }`);
            expect(response.statusCode).toBe(500);
            
            });

 it("POST api/blogs/:id :Updating blog", async()=>{
    const response=await supertest(app).patch('/api/blogs/'+blogID).
    set('Authorization', `Bearer ${  Authtoken }`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success')
    
});
it("POST api/blogs/:id :Updating blog without Authorization", async()=>{
    const response=await supertest(app).patch('/api/blogs/'+blogID);
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Unauthorized. Token not provided.')
    
});
// it("POST api/blogs/:id :Updating blog with invalidblog", async()=>{
//     const response=await supertest(app).put('/api/blogs/'+blogID);
//     expect(response.statusCode).toBe(404);
//     expect(response.body.status).toBe('error');
//     expect(response.body.message).toBe('Unauthorized. Token not provided.')
    
// });


 it("POST /api/blogs/blogID/likes :Liking blog", async()=>{
    const response =await supertest(app).post(`/api/blogs/65d66cb23036687dbc528daf/likes`)
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success')

 });
 it("POST /api/blogs/blogID/dislikes :Disliking blog", async()=>{
    const response =await supertest(app).post(`/api/blogs/65d66cb23036687dbc528daf/dislikes`)
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success')

 });
 it("POST /api/blogs/blogID/likes :Disliking blog", async()=>{
    const response =await supertest(app).post(`/api/blogs/65d66cb23036687dbc528daf/dislikes`)
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success')

 });
 it("POST /api/blogs/blogID/likes :Views blog", async()=>{
    const response =await supertest(app).post(`/api/blogs/65d66cb23036687dbc528daf/views`)
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success')

 });

});

describe("Creation Comments", () => {
    let commentsID: string;
    let validBlogsID:string;

    it("POST api/blogs/:id/comments: Creating Comments with invalid blogID", async () => {
        const invalidBlogID = '65dc38b80b7794d88593a5g7';
        const response = await supertest(app)
       
            .post('/api/blogs/' + 'invalidBlogID' + '/comments')  
            .send({
                "CommenterName": "ISHIMWE Ami Paradis",
                "commenterEmail": "pishimwe@gmail.com",
                "text": "I love coding"
            })
            .set('Authorization', `Bearer ${Authtoken}`);

        expect(response.statusCode).toBe(403);
        
    });

    it("POST api/blogs/:id/comments: Creating Comments with valid blogID", async () => {
        const validBlogsResponse = await supertest(app).get('/api/blogs');
        const validBlogs = validBlogsResponse.body;

        if (validBlogs.length > 0) {
            const validBlogsID = validBlogs[0]._id;

            const response = await supertest(app)
                .post(`/api/blogs/${validBlogsID}/comments`)
                .send({
                    "commenterName": "ISHIMWE Ami Paradis",
                    "commenterEmail": "pishimwe@gmail.com",
                    "text": "I love coding"
                })
                .set('Authorization', `Bearer ${Authtoken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');

            const validComments = await supertest(app).get(`/api/blogs/${validBlogsID}/comments`);
            commentsID = validComments.body.data[0]._id;
        }
    });

    it("POST api/blogs/:id/comments: Creating Comments without validations and valid blogID", async () => {
        const validBlogsResponse = await supertest(app).get('/api/blogs');
        const validBlogs = validBlogsResponse.body;

        if (validBlogs.length > 0) {
            const validBlogsID = validBlogs[0]._id;

            const response = await supertest(app)
                .post(`/api/blogs/${validBlogsID}/comments`)
                .send({
                    "commenterName": "ISHIMWE Ami Paradis",
                    "commenterEmail": "pishimwe@gmail.com",
                    "text": "I love coding"
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.status).toBe('error');
        }
    });

    it('Fetching All comments', async () => {
        const response = await supertest(app).get('/api/blogs/comments');
        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe('error');
    });

    it('Should return status code of 404 for non-existent comment ID', async () => {
        const nonExistentCommentID = '65d843c54ce239abd16ddaf7';
        const response = await supertest(app).get('/api/comments/' + 'nonExistentCommentID'); 
        expect(response.statusCode).toBe(404);
    });

    it('Deleting Comments', async () => {
    
        const response = await supertest(app)
            .delete(`/api/blogs/${validBlogsID}/comments/${commentsID}`)
            .set('Authorization', `Bearer ${Authtoken}`);

        expect(response.statusCode).toBe(500);
    });
});
});