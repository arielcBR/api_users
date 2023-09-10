require('express-async-errors');
const express = require('express');
const app = express();
const router = require('./routes/routes');  
const AppError = require('./utils/AppError');
const PORT = 3000;

app.use(express.json());
app.use('/', router);
app.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

app.listen(PORT, () => console.log(`Servidor on port ${PORT}`));