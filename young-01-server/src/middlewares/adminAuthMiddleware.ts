module.exports = (req, res, next) => {
    const isAdmin = req.user?.groups?.includes('admin');
    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: '관리자 권한이 필요합니다',
        });
    }
    next();
};
