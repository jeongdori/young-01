const request = require('supertest');
const app = require('@/app');

let accessToken;

beforeAll(async () => {
    const res = await request(app).post('/auth/login').send({
        email: 'user1@example.com',
        password: 'qwer1234',
    });

    accessToken = res.body.data.accessToken;
});

describe('User API', () => {
    it('GET /users/me - 내 정보 조회', async () => {
        const res = await request(app).get('/users/me').set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.success).toBe(true);
    });

    it('PUT /users/me - 내 정보 수정', async () => {
        const res = await request(app).put('/users/me').set('Authorization', `Bearer ${accessToken}`).send({
            name: '수정된 이름',
            email: 'user1@example.com',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('수정 완료');
    });

    it('GET /users/:id - 사용자 상세 조회', async () => {
        const res = await request(app).get('/users/1').set('Authorization', `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('id', 1);
    });
});
