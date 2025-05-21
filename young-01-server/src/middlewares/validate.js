const { resError } = require('@utils/response');

module.exports = (schemas) => {
    return (req, res, next) => {
        const targets = {
            body: req.body,
            query: req.query,
            params: req.params,
        };

        for (const key of Object.keys(schemas)) {
            const schema = schemas[key];
            const { error, value } = schema.validate(targets[key], {
                abortEarly: true,
            });

            if (error) {
                const message = error.details.map((d) => d.message).join(', ');
                return resError(res, 'VALIDATION_ERROR', 400, message);
            }

            // 유효성 통과된 데이터 저장
            req[`validated${capitalize(key)}`] = value;
        }

        next();
    };
};

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
