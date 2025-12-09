import express from "express";

const router = express.Router();
router.get('/current-date', (req, res) => {
    // Lấy ngày hiện tại và định dạng nó
    const now = new Date();
    // Định dạng thành YYYY-MM-DD
    const dateString = now.toISOString().split('T')[0];

    res.json({ success: true, currentDate: dateString });
});
export default router;