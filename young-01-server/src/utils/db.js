const db = require('@/config/db');

const paramRegex = /:(\w+)/g;

function mapNamedParams(sql, paramsObj = {}) {
    const values = [];
    const parsedSql = sql.replace(paramRegex, (_, key) => {
        if (!(key in paramsObj)) {
            throw new Error(`SQL parameter ":${key}" is missing from provided params`);
        }
        values.push(paramsObj[key]);
        return '?';
    });

    return { sql: parsedSql, values };
}

function prepare(sql, params) {
    if (Array.isArray(params)) {
        return { sql, values: params };
    }
    return mapNamedParams(sql, params);
}

const dbUtils = {
    /**
     * 단일 SELECT (1건만 반환)
     */
    async selectOne(sql, params = [], conn = null) {
        const { sql: parsedSql, values } = prepare(sql, params);
        const [rows] = await (conn || db).execute(parsedSql, values);
        return rows[0] || null;
    },

    /**
     * 일반 SELECT (여러 건)
     */
    async select(sql, params = [], conn = null) {
        const { sql: parsedSql, values } = prepare(sql, params);
        const [rows] = await (conn || db).execute(parsedSql, values);
        return rows;
    },

    /**
     * UPDATE / DELETE / INSERT 단일 쿼리
     */
    async exec(sql, params = [], conn = null) {
        const { sql: parsedSql, values } = prepare(sql, params);
        const [result] = await (conn || db).execute(parsedSql, values);
        return result;
    },

    async paginate(sql, params = [], page = 1, limit = 10, conn = null) {
        const { sql: parsedSql, values } = prepare(sql, params);
        const offset = (page - 1) * limit;
        const pagedSql = `${parsedSql} LIMIT ? OFFSET ?`;
        const fullParams = [...values, limit, offset];
        const [rows] = await (conn || db).execute(pagedSql, fullParams);
        return rows;
    },

    /**
     * 다중 INSERT (객체 배열 기반, 커넥션 옵션 포함)
     * @param {string} table - 테이블명
     * @param {Array<object>} rows - insert할 데이터 배열
     * @param {object|null} conn - 커넥션 객체 (optional)
     */
    async bulkInsert(table, rows, conn = null) {
        if (!rows || rows.length === 0) return;

        const keys = Object.keys(rows[0]);
        const placeholders = rows.map(() => `(${keys.map(() => '?').join(', ')})`).join(', ');
        const values = rows.flatMap((row) => keys.map((key) => row[key]));

        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES ${placeholders}`;
        return (conn || db).execute(sql, values);
    },

    /**
     * INSERT + 중복 시 UPDATE (커넥션 옵션 포함)
     */
    async bulkInsertOrUpdate(table, rows, updateKeys, conn = null) {
        if (!rows || rows.length === 0) return;

        const keys = Object.keys(rows[0]);
        const placeholders = rows.map(() => `(${keys.map(() => '?').join(', ')})`).join(', ');
        const values = rows.flatMap((row) => keys.map((key) => row[key]));
        const updateSql = updateKeys.map((k) => `${k} = VALUES(${k})`).join(', ');

        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES ${placeholders} ON DUPLICATE KEY UPDATE ${updateSql}`;
        return (conn || db).execute(sql, values);
    },

    /**
     * 트랜잭션을 처리하는 고차함수 (withTransaction)
     * @param {Function} callback - async (conn) => {}
     * @returns {Promise<any>}
     */
    async withTransaction(callback) {
        const conn = await db.getConnection();
        const trx = {
            selectOne: (sql, params) => dbUtils.selectOne(sql, params, conn),
            select: (sql, params) => dbUtils.select(sql, params, conn),
            exec: (sql, params) => dbUtils.exec(sql, params, conn),
            paginate: (sql, params, page, limit) => dbUtils.paginate(sql, params, page, limit, conn),
            bulkInsert: (table, rows) => dbUtils.bulkInsert(table, rows, conn),
            bulkInsertOrUpdate: (table, rows, keys) => dbUtils.bulkInsertOrUpdate(table, rows, keys, conn),
        };

        try {
            await conn.beginTransaction();
            const result = await callback(trx);
            await conn.commit();
            return result;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },
};

module.exports = dbUtils;
