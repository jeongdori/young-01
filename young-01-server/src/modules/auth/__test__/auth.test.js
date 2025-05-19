const request = require('supertest');
const app = require('@/app');

describe('Auth API', () => {
    it.skip('POST /auth/register - 회원가입 성공', async () => {
        const res = await request(app).post('/auth/register').send({
            email: 'testuser1@example.com',
            password: 'qwer1234',
            name: '테스트유저',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('POST /auth/login - 로그인 성공', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'user1@example.com',
            password: 'qwer1234',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
    });

    it('POST /auth/login - 로그인 실패 (비밀번호 틀림)', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'user1@example.com',
            password: 'wrongpassword',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});
