const express = require('express');
const AccessType = require('../models/accesstype');
const router = express.Router();

const handleError = (res, error, customMessage) => {
    console.error(error);
    res.status(500).json({ message: customMessage || 'An error occurred', error });
};
router.get('/create-mock-access-type', async (req, res) => {
    try {
        const ACCESS_TYPES = [
            {
                name: "PUBLIC",
                description: 'Everyone can access this access type'
            },
            {
                name: "PRIVATE",
                description: 'Who is included in this related list can access this access type'
            }
        ]

        const createdAccessTypes = await Promise.all(ACCESS_TYPES.map(async (accessType) => {
            const convertedAT = new AccessType(accessType);
            return await convertedAT.save();
        }))

        res.status(200).json({ message: 'Create access types sucessfully', data: createdAccessTypes })
    } catch (error) {
        handleError(res, error, 'Error');
    }
})

// API để lấy danh sách tất cả các access type
router.get('/all', async (req, res) => {
    try {
        // Tìm tất cả các access type trong cơ sở dữ liệu
        const accessTypes = await AccessType.find();

        // Trả về danh sách các access type
        res.status(200).json({ message: 'Fetch access types successfully', data: accessTypes });
    } catch (error) {
        handleError(res, error, 'Error fetching access types');
    }
});

module.exports = router;