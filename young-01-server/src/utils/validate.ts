// 필수값 체크
exports.requireFields = (obj, keys) => {
    for (const key of keys) {
        if (!obj[key]) {
            throw new Error(`필수값 누락: ${key}`);
        }
    }
};
